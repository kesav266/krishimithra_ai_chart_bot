from __future__ import annotations

from typing import Any

from pypdf import PdfReader


class SoilAdvisor:
    def analyze(self, n: float | None, p: float | None, k: float | None, ph: float | None, pdf_bytes: bytes | None = None) -> dict[str, Any]:
        extracted = self._extract_pdf_values(pdf_bytes) if pdf_bytes else {}
        n = n if n is not None else extracted.get("n")
        p = p if p is not None else extracted.get("p")
        k = k if k is not None else extracted.get("k")
        ph = ph if ph is not None else extracted.get("ph")
        values = {"n": n, "p": p, "k": k, "ph": ph}
        deficiencies = []
        if n is not None and n < 280:
            deficiencies.append("Nitrogen is low: add compost, green manure, or split urea doses as per crop stage.")
        if p is not None and p < 22:
            deficiencies.append("Phosphorus is low: use DAP/SSP based on soil test and crop requirement.")
        if k is not None and k < 120:
            deficiencies.append("Potassium is low: apply MOP or organic potassium sources where appropriate.")
        if ph is not None and ph < 6.0:
            deficiencies.append("Soil is acidic: consider lime after local expert confirmation.")
        if ph is not None and ph > 8.0:
            deficiencies.append("Soil is alkaline: improve organic matter and use gypsum only after soil test advice.")
        if not deficiencies:
            deficiencies.append("Major soil indicators look balanced. Maintain organic matter and test every season.")
        improvement = min(28, 8 + len(deficiencies) * 5)
        return {
            "values": values,
            "deficiency_analysis": deficiencies,
            "recommended_fertilizer": self._fertilizer_plan(n, p, k, ph),
            "expected_yield_improvement_percent": improvement,
        }

    def _extract_pdf_values(self, pdf_bytes: bytes | None) -> dict[str, float]:
        if not pdf_bytes:
            return {}
        import io
        import re

        text = ""
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages[:4]:
            text += page.extract_text() or ""
        values: dict[str, float] = {}
        patterns = {"n": r"\bN(?:itrogen)?\D+(\d+(?:\.\d+)?)", "p": r"\bP(?:hosphorus)?\D+(\d+(?:\.\d+)?)", "k": r"\bK(?:potassium)?\D+(\d+(?:\.\d+)?)", "ph": r"\bpH\D+(\d+(?:\.\d+)?)"}
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                values[key] = float(match.group(1))
        return values

    def _fertilizer_plan(self, n: float | None, p: float | None, k: float | None, ph: float | None) -> list[str]:
        plan = ["Use soil-test based fertilizer dose recommended by local KVK for the selected crop."]
        if n is not None and n < 280:
            plan.append("Increase organic manure and apply nitrogen in split doses.")
        if p is not None and p < 22:
            plan.append("Apply phosphorus near root zone at sowing.")
        if k is not None and k < 120:
            plan.append("Add potassium to improve stress tolerance and grain/fruit quality.")
        if ph is not None and (ph < 6 or ph > 8):
            plan.append("Correct pH gradually; avoid over-application of amendments.")
        return plan
