from __future__ import annotations

import os
from functools import lru_cache

import google.generativeai as genai


class TranslationService:
    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.enabled = os.getenv("ENABLE_GEMINI_TRANSLATION", "").lower() == "true"
        if self.api_key and self.enabled:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-2.5-flash")
        else:
            self.model = None

    @lru_cache(maxsize=128)
    def _cached_translate(self, text: str, language: str) -> str:
        prompt = (
            f"Translate this farming advice into {language}. "
            "Use simple farmer-friendly language. Keep numbers and safety warnings exact.\n\n"
            f"{text}"
        )
        try:
            return self.model.generate_content(prompt, request_options={"timeout": 4}).text
        except Exception:
            return text

    def translate(self, text: str, language: str) -> str:
        language = (language or "English").strip()
        if language.lower() == "english" or not text:
            return text
        if not self.model:
            return self._local_translate(text, language)
        return self._cached_translate(text[:5000], language)

    def _local_translate(self, text: str, language: str) -> str:
        if language.lower() == "telugu":
            return self._translate_to_telugu(text)
        if language.lower() == "hindi":
            return self._translate_to_hindi(text)
        return text

    def _translate_to_telugu(self, text: str) -> str:
        replacements = {
            "Check the underside of leaves and use yellow sticky traps for monitoring.":
                "ఆకుల క్రింద భాగాన్ని పరిశీలించండి మరియు పర్యవేక్షణ కోసం మాండలిక పసిడి త్రాప్‌లను ఉపయోగించండి.",
            "Remove heavily infested plant parts, encourage natural enemies, and spray only when pest pressure is above the local threshold.":
                "భారీగా సంభ్రమిత మొక్క భాగాలను తీసి వేయండి, సహజ శత్రువులను ప్రోత్సహించండి, మరియు పురుగు ఒత్తిడి స్థానిక పరిమితిని దాటినప్పుడు మాత్రమే రసాయనాలను స్ప్రే చేయండి.",
            "Use soil-test based fertilizer. Add organic manure, split nitrogen doses by crop stage, and avoid applying extra fertilizer before rain.":
                "మట్టిభద్రత పరీక్ష ఆధారంగా ఎరువును ఉపయోగించండి. జీవాజ్యంతు ముడిని జోడించండి, ఫసల దశల ప్రకారం నైట్రోజన్ మోతాదులను విభజించండి, మరియు వర్షానికి ముందు అదనపు ఎరువు వేయవద్దు.",
            "Irrigate in the early morning or evening. Avoid pesticide spraying during rain, high wind, or when leaves are wet.":
                "ఉదయం తొలగినీ లేదా సాయంత్రం నీరు పెట్టండి. వర్షంలో, బలమైన గాలిలో లేదా ఆకులు తడి ఉన్నప్పుడు పురుగు మందు స్ప్రే చేయకుండా ఉండండి.",
            "Please share crop name, visible symptoms, affected area, village or district, and recent weather. Meanwhile, remove badly affected leaves, keep field sanitation, and avoid blanket chemical spraying.":
                "దయచేసి పంట పేరు, కనిపించే లక్షణాలు, ప్రభావిత ప్రాంతం, గ్రామం లేదా జిల్లా, మరియు ఇటీవల వాతావరణాన్ని పంచుకోండి. అప్పటికి, క్షుణ్ణంగా కాలుష్యానికి గురైన ఆకులను తీసి వేయండి, చిత్ర శుభ్రతను ఉంచండి, మరియు మొత్తం పొలంలో రసాయనాలను ఫైను చేయకుండా ఉండండి.",
            "Relevant guidance:": "సంబంధిత మార్గదర్శకం:",
            "AI recommendations are advisory only. If more than 30% of the field is affected, or symptoms spread quickly, consult an agricultural officer before treatment.":
                "AI సిఫార్సులు సలహా మాత్రమే. పొలం 30% కన్నా ఎక్కువగా ప్రభావితమైతే లేదా లక్షణాలు త్వరగా వ్యాప్తి అయితే, చికిత్సకు ముందు వ్యవసాయం అధికారి ని సంప్రదించండి.",
        }
        for source, target in replacements.items():
            text = text.replace(source, target)
        return text

    def _translate_to_hindi(self, text: str) -> str:
        replacements = {
            "Check the underside of leaves and use yellow sticky traps for monitoring.":
                "पत्तियों के नीचे की सतह की जांच करें और निगरानी के लिए पीले चिपचिपे ट्रैप का उपयोग करें।",
            "Remove heavily infested plant parts, encourage natural enemies, and spray only when pest pressure is above the local threshold.":
                "भारी रूप से प्रभावित पौधे के हिस्सों को हटा दें, प्राकृतिक शत्रुओं को प्रोत्साहित करें, और केवल तब रसायन छिड़कें जब कीट दबाव स्थानीय सीमा से ऊपर हो।",
            "Use soil-test based fertilizer. Add organic manure, split nitrogen doses by crop stage, and avoid applying extra fertilizer before rain.":
                "मिट्टी परीक्षण आधारित उर्वरक का उपयोग करें। कार्बनिक खाद मिलाएं, पौधे की अवस्था के अनुसार नाइट्रोजन की खुराक बांटें, और बारिश से पहले अतिरिक्त उर्वरक लगाने से बचें।",
            "Irrigate in the early morning or evening. Avoid pesticide spraying during rain, high wind, or when leaves are wet.":
                "सुबह जल्दी या शाम को सिंचाईं करें। बारिश, तेज हवा, या जब पत्तियां गीली हों, तो कीटनाशक छिड़काव से बचें।",
            "Please share crop name, visible symptoms, affected area, village or district, and recent weather. Meanwhile, remove badly affected leaves, keep field sanitation, and avoid blanket chemical spraying.":
                "कृपया फसल का नाम, दिखाई देने वाले लक्षण, प्रभावित क्षेत्र, गांव या जिला, और हाल का मौसम साझा करें। फिलहाल, खराब प्रभावित पत्तियों को हटा दें, खेत की सफाई रखें, और पूरे क्षेत्र में रसायन छिड़काव से बचें।",
            "Relevant guidance:": "संबंधित मार्गदर्शन:",
            "AI recommendations are advisory only. If more than 30% of the field is affected, or symptoms spread quickly, consult an agricultural officer before treatment.":
                "AI सिफारिशें केवल सलाहात्मक हैं। यदि क्षेत्र का 30% से अधिक हिस्सा प्रभावित हो या लक्षण तेजी से फैलते हों, तो उपचार से पहले एक कृषि अधिकारी से परामर्श करें।",
        }
        for source, target in replacements.items():
            text = text.replace(source, target)
        return text
