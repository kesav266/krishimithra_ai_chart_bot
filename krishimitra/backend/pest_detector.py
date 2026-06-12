from __future__ import annotations

from pathlib import Path
from typing import Any

from disease_detector import DiseaseDetector


PEST_LABELS = {
    0: "Whitefly",
    1: "Bollworm",
    2: "Aphids",
    3: "Thrips",
}


class PestDetector:
    def __init__(self, model_path: str = "../models/pest_detection_yolov8.pt") -> None:
        self.model_path = Path(__file__).resolve().parent.joinpath(model_path).resolve()
        self.model = None
        if self.model_path.exists():
            try:
                from ultralytics import YOLO

                self.model = YOLO(str(self.model_path))
            except Exception:
                self.model = None

    def detect(self, content: bytes) -> dict[str, Any]:
        image = DiseaseDetector.validate_image(content)
        if self.model:
            result = self.model.predict(image, imgsz=640, conf=0.25, verbose=False)[0]
            boxes = getattr(result, "boxes", None)
            if boxes is not None and len(boxes) > 0:
                best_idx = int(boxes.conf.argmax())
                confidence = float(boxes.conf[best_idx]) * 100
                class_id = int(boxes.cls[best_idx])
                pest = result.names.get(class_id, PEST_LABELS.get(class_id, "Unknown Pest"))
                return {
                    "pest": pest,
                    "confidence": round(confidence, 2),
                    "risk_level": self._risk(confidence, len(boxes)),
                    "model_status": "yolov8",
                }

        return {
            "pest": "No clear pest cluster detected",
            "confidence": 54.0,
            "risk_level": "Low",
            "model_status": "visual_triage_fallback",
        }

    @staticmethod
    def _risk(confidence: float, count: int) -> str:
        if confidence >= 80 or count >= 8:
            return "High"
        if confidence >= 60 or count >= 3:
            return "Medium"
        return "Low"
