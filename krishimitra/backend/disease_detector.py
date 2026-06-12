from __future__ import annotations

import io
from pathlib import Path
from typing import Any

from PIL import Image, ImageStat


DISEASE_LABELS = {
    0: "Cotton Leaf Curl Virus",
    1: "Early Blight",
    2: "Late Blight",
    3: "Rust",
    4: "Bacterial Spot",
    5: "Healthy Leaf",
}


class DiseaseDetector:
    def __init__(self, model_path: str = "../models/crop_disease_yolov8.pt") -> None:
        self.model_path = Path(__file__).resolve().parent.joinpath(model_path).resolve()
        self.model = None
        if self.model_path.exists():
            try:
                from ultralytics import YOLO

                self.model = YOLO(str(self.model_path))
            except Exception:
                self.model = None

    @staticmethod
    def validate_image(content: bytes, max_mb: int = 8) -> Image.Image:
        if not content:
            raise ValueError("Image is required.")
        if len(content) > max_mb * 1024 * 1024:
            raise ValueError(f"Image must be smaller than {max_mb} MB.")
        try:
            image = Image.open(io.BytesIO(content)).convert("RGB")
            image.verify()
            return Image.open(io.BytesIO(content)).convert("RGB")
        except Exception as exc:
            raise ValueError("Upload a valid JPG or PNG crop image.") from exc

    def detect(self, content: bytes) -> dict[str, Any]:
        image = self.validate_image(content)
        if self.model:
            result = self.model.predict(image, imgsz=640, conf=0.25, verbose=False)[0]
            boxes = getattr(result, "boxes", None)
            if boxes is not None and len(boxes) > 0:
                best_idx = int(boxes.conf.argmax())
                confidence = float(boxes.conf[best_idx]) * 100
                class_id = int(boxes.cls[best_idx])
                disease = result.names.get(class_id, DISEASE_LABELS.get(class_id, "Unknown Disease"))
                affected = self._affected_area_percent(result)
                return {
                    "disease": disease,
                    "confidence": round(confidence, 2),
                    "severity": self._severity(affected, confidence),
                    "affected_area_percent": affected,
                    "model_status": "yolov8",
                }

        return self._visual_triage(image)

    def _affected_area_percent(self, result: Any) -> float:
        boxes = getattr(result, "boxes", None)
        if boxes is None or len(boxes) == 0:
            return 0.0
        h, w = result.orig_shape[:2]
        total = w * h
        area = 0.0
        for xyxy in boxes.xyxy:
            x1, y1, x2, y2 = [float(v) for v in xyxy]
            area += max(0.0, x2 - x1) * max(0.0, y2 - y1)
        return round(min(100.0, (area / total) * 100), 2)

    def _visual_triage(self, image: Image.Image) -> dict[str, Any]:
        stat = ImageStat.Stat(image.resize((96, 96)))
        red, green, blue = stat.mean
        brightness = sum(stat.mean) / 3
        green_ratio = green / max(1, red + green + blue)
        stress = max(0.0, min(100.0, (0.37 - green_ratio) * 250 + (95 - brightness) * 0.15))
        disease = "Healthy Leaf" if stress < 18 else "Visual Stress Detected"
        confidence = 62.0 if stress < 18 else min(78.0, 45.0 + stress * 0.45)
        return {
            "disease": disease,
            "confidence": round(confidence, 2),
            "severity": self._severity(stress, confidence),
            "affected_area_percent": round(stress, 2),
            "model_status": "image_triage_fallback",
        }

    @staticmethod
    def _severity(affected_percent: float, confidence: float) -> str:
        score = affected_percent * (confidence / 100)
        if score >= 30:
            return "High"
        if score >= 15:
            return "Medium"
        return "Low"
