from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib


class YieldPredictor:
    def __init__(self, model_path: str = "../models/yield_prediction.pkl") -> None:
        self.model_path = Path(__file__).resolve().parent.joinpath(model_path).resolve()
        self.model = joblib.load(self.model_path) if self.model_path.exists() else None

    def predict(self, crop_type: str, area_acres: float, rainfall_mm: float, fertilizer_kg: float) -> dict[str, Any]:
        crop_factor = {
            "rice": 1.25,
            "paddy": 1.25,
            "wheat": 1.05,
            "cotton": 0.72,
            "maize": 1.15,
            "chilli": 0.82,
            "tomato": 1.4,
        }.get(crop_type.lower(), 1.0)
        if self.model:
            try:
                prediction = float(self.model.predict([[area_acres, rainfall_mm, fertilizer_kg, crop_factor]])[0])
                confidence = 82
                status = "xgboost_model"
            except Exception:
                prediction, confidence, status = self._heuristic(area_acres, rainfall_mm, fertilizer_kg, crop_factor)
        else:
            prediction, confidence, status = self._heuristic(area_acres, rainfall_mm, fertilizer_kg, crop_factor)
        risk = "Low" if confidence >= 80 else "Medium" if confidence >= 65 else "High"
        return {
            "expected_yield_quintals": round(prediction, 2),
            "confidence": confidence,
            "risk_category": risk,
            "model_status": status,
        }

    def _heuristic(self, area: float, rainfall: float, fertilizer: float, crop_factor: float) -> tuple[float, int, str]:
        rain_score = max(0.45, min(1.25, rainfall / 750))
        fert_score = max(0.55, min(1.18, fertilizer / max(area, 0.1) / 55))
        yield_q = area * 18 * crop_factor * rain_score * fert_score
        confidence = 68 if 400 <= rainfall <= 1100 and fertilizer > 0 else 58
        return yield_q, confidence, "agronomic_fallback"
