from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

import google.generativeai as genai

from translation_service import TranslationService


DISCLAIMER = (
    "AI recommendations are advisory only. If more than 30% of the field is affected, "
    "or symptoms spread quickly, consult an agricultural officer before treatment."
)


class AIAdvisor:
    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.enable_advice = os.getenv("ENABLE_GEMINI_ADVICE", "").lower() == "true"
        self.enable_chat = os.getenv("ENABLE_GEMINI_CHAT", "").lower() == "true"
        self.translator = TranslationService()
        if self.api_key and (self.enable_advice or self.enable_chat):
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-2.5-flash")
        else:
            self.model = None

    def crop_advice(
        self,
        crop_type: str,
        location: str,
        diagnosis: dict[str, Any],
        weather: dict[str, Any],
        language: str = "English",
    ) -> str:
        fallback = self._fallback_advice(crop_type, diagnosis, weather)
        if not self.model or not self.enable_advice:
            return self.translator.translate(fallback, language)

        prompt = self._advice_prompt(crop_type, location, diagnosis, weather)
        try:
            text = self._generate(prompt, 5)
        except Exception:
            text = fallback
        return self.translator.translate(text, language)

    def quick_crop_advice(
        self,
        crop_type: str,
        location: str,
        diagnosis: dict[str, Any],
        weather: dict[str, Any],
        language: str = "English",
    ) -> str:
        return self.translator.translate(self._fallback_advice(crop_type, diagnosis, weather), language)

    def _advice_prompt(
        self,
        crop_type: str,
        location: str,
        diagnosis: dict[str, Any],
        weather: dict[str, Any],
    ) -> str:
        return f"""
You are KrishiMitra AI, an Indian agriculture extension assistant.
Use simple farmer-friendly language.

Crop: {crop_type or "Unknown"}
Location: {location or weather.get("location", "Unknown")}
Diagnosis: {diagnosis}
Weather: {weather}

Return exactly these sections:
1. Diagnosis
2. Treatment
3. Prevention
4. Sustainability Tips
5. Expert Warning

Always include this warning: {DISCLAIMER}
"""

    def chat(
        self,
        message: str,
        history: list[dict[str, str]],
        language: str = "English",
        retrieved_context: list[dict[str, Any]] | None = None,
    ) -> str:
        local_reply = self._fallback_chat(message, retrieved_context)
        if not self.model or not self.enable_chat:
            return self.translator.translate(local_reply, language)
        compact_history = "\n".join(
            f"{item['role'].capitalize()}: {item['content']}" for item in history[-4:]
        )
        context = "\n".join(
            f"- {item.get('source', 'source')}: {item.get('snippet', '')}"
            for item in (retrieved_context or [])[:3]
        )
        prompt = f"""
You are KrishiMitra AI, a practical farming assistant for Indian farmers.
Answer fertilizer, irrigation, disease, pest, soil, and sustainability questions.
Keep advice safe, simple, and local.
Use retrieved agriculture guidance when relevant.
Respond in {language}.

Retrieved guidance:
{context or "No matching local guidance found."}

Conversation:
{compact_history}
User: {message}
Assistant:
Please answer directly, without extra sections or repeated instructions.
"""
        try:
            text = self._generate(prompt, 6)
        except Exception:
            text = local_reply
        return self.translator.translate(text, language)

    @lru_cache(maxsize=96)
    def _generate(self, prompt: str, timeout: int) -> str:
        return self.model.generate_content(prompt, request_options={"timeout": timeout}).text.strip()

    def _fallback_chat(self, message: str, retrieved_context: list[dict[str, Any]] | None) -> str:
        text = message.lower()
        guidance = " ".join(item.get("snippet", "") for item in (retrieved_context or [])[:2])
        if any(word in text for word in ["pest", "whitefly", "aphid", "bollworm", "thrips", "insect"]):
            answer = (
                "Check the underside of leaves and use yellow sticky traps for monitoring. "
                "Remove heavily infested plant parts, encourage natural enemies, and spray only when pest pressure is above the local threshold."
            )
        elif any(word in text for word in ["fertilizer", "npk", "soil", "urea", "dap", "potash"]):
            answer = (
                "Use soil-test based fertilizer. Add organic manure, split nitrogen doses by crop stage, and avoid applying extra fertilizer before rain."
            )
        elif any(word in text for word in ["water", "irrigation", "rain", "heat"]):
            answer = (
                "Irrigate in the early morning or evening. Avoid pesticide spraying during rain, high wind, or when leaves are wet."
            )
        else:
            answer = (
                "Please share crop name, visible symptoms, affected area, village or district, and recent weather. "
                "Meanwhile, remove badly affected leaves, keep field sanitation, and avoid blanket chemical spraying."
            )
        if guidance:
            answer += f"\n\nRelevant guidance: {guidance[:500]}"
        return f"{answer}\n\n{DISCLAIMER}"

    def _fallback_advice(self, crop_type: str, diagnosis: dict[str, Any], weather: dict[str, Any]) -> str:
        disease = diagnosis.get("disease") or diagnosis.get("pest") or "crop stress"
        alerts = " ".join(weather.get("alerts", []))
        return (
            f"1. Diagnosis\n{crop_type or 'The crop'} shows signs of {disease}.\n\n"
            "2. Treatment\nRemove highly affected leaves, avoid blanket chemical use, and use locally approved bio-control or pesticide only after label verification.\n\n"
            "3. Prevention\nKeep field sanitation, avoid overhead irrigation when humidity is high, rotate crops, and monitor weekly.\n\n"
            f"4. Sustainability Tips\nUse targeted spraying, compost, mulching, and water-efficient irrigation. Weather note: {alerts}\n\n"
            f"5. Expert Warning\n{DISCLAIMER}"
        )
