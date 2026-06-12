from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_advisor import AIAdvisor, DISCLAIMER
from disease_detector import DiseaseDetector
from firebase_service import FirebaseService
from pest_detector import PestDetector
from rag_service import RAGService
from soil_advisor import SoilAdvisor
from weather_service import WeatherService
from yield_predictor import YieldPredictor

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / "api.env")

app = FastAPI(
    title="KrishiMitra AI API",
    version="1.0.0",
    description="Smart Crop Doctor and Sustainable Farming Assistant for Indian farmers.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

disease_detector = DiseaseDetector()
pest_detector = PestDetector()
weather_service = WeatherService()
advisor = AIAdvisor()
rag = RAGService()
soil_advisor = SoilAdvisor()
yield_predictor = YieldPredictor()
firebase = FirebaseService()


class WeatherRequest(BaseModel):
    lat: float | None = None
    lon: float | None = None
    city: str | None = None


class AdvisorRequest(BaseModel):
    crop_type: str = ""
    location: str = ""
    diagnosis: dict[str, Any] = Field(default_factory=dict)
    weather: dict[str, Any] = Field(default_factory=dict)
    language: str = "English"


class ChatRequest(BaseModel):
    message: str
    history: list[dict[str, str]] = Field(default_factory=list)
    language: str = "English"


class YieldRequest(BaseModel):
    crop_type: str
    area_acres: float = Field(gt=0)
    rainfall_mm: float = Field(ge=0)
    fertilizer_kg: float = Field(ge=0)


class RAGRequest(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=5)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "KrishiMitra AI",
        "disclaimer": DISCLAIMER,
    }


@app.post("/detect/disease")
async def detect_disease(
    image: UploadFile = File(...),
    crop_type: str = Form(""),
    location: str = Form(""),
    language: str = Form("English"),
    lat: float | None = Form(None),
    lon: float | None = Form(None),
    city: str | None = Form(None),
) -> dict[str, Any]:
    _validate_upload(image)
    content = await image.read()
    try:
        diagnosis, weather = await asyncio.gather(
            run_in_threadpool(disease_detector.detect, content),
            run_in_threadpool(weather_service.current, lat, lon, city or location),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    advice = await run_in_threadpool(advisor.quick_crop_advice, crop_type, location, diagnosis, weather, language)
    payload = {
        "diagnosis": diagnosis,
        "weather": weather,
        "advice": advice,
        "expert_warning": DISCLAIMER,
    }
    firebase.save_event("disease_scans", payload)
    return payload


@app.post("/detect/pest")
async def detect_pest(
    image: UploadFile = File(...),
    crop_type: str = Form(""),
    location: str = Form(""),
    language: str = Form("English"),
    lat: float | None = Form(None),
    lon: float | None = Form(None),
    city: str | None = Form(None),
) -> dict[str, Any]:
    _validate_upload(image)
    content = await image.read()
    try:
        diagnosis, weather = await asyncio.gather(
            run_in_threadpool(pest_detector.detect, content),
            run_in_threadpool(weather_service.current, lat, lon, city or location),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    advice = await run_in_threadpool(advisor.quick_crop_advice, crop_type, location, diagnosis, weather, language)
    payload = {
        "diagnosis": diagnosis,
        "weather": weather,
        "advice": advice,
        "expert_warning": DISCLAIMER,
    }
    firebase.save_event("pest_scans", payload)
    return payload


@app.post("/weather")
def weather(request: WeatherRequest) -> dict[str, Any]:
    return weather_service.current(lat=request.lat, lon=request.lon, city=request.city)


@app.post("/advisor")
def generate_advice(request: AdvisorRequest) -> dict[str, str]:
    text = advisor.crop_advice(request.crop_type, request.location, request.diagnosis, request.weather, request.language)
    return {"advice": text, "expert_warning": DISCLAIMER}


@app.post("/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    retrieved = rag.retrieve(request.message, 3)
    reply = advisor.chat(request.message, request.history, request.language, retrieved["sources_used"])
    firebase.save_event("chat_messages", {"message": request.message, "reply": reply, "language": request.language})
    return {"reply": reply, "sources_used": retrieved["sources_used"]}


@app.post("/rag/query")
def rag_query(request: RAGRequest) -> dict[str, Any]:
    return rag.retrieve(request.query, request.top_k)


@app.post("/soil/analyze")
async def soil_analyze(
    n: float | None = Form(None),
    p: float | None = Form(None),
    k: float | None = Form(None),
    ph: float | None = Form(None),
    report: UploadFile | None = File(None),
) -> dict[str, Any]:
    pdf_bytes = None
    if report:
        if report.content_type not in {"application/pdf", "application/octet-stream"}:
            raise HTTPException(status_code=400, detail="Upload a valid PDF soil report.")
        pdf_bytes = await report.read()
        if len(pdf_bytes) > 8 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Soil report must be smaller than 8 MB.")
    result = soil_advisor.analyze(n, p, k, ph, pdf_bytes)
    firebase.save_event("soil_reports", result)
    return result


@app.post("/yield/predict")
def yield_predict(request: YieldRequest) -> dict[str, Any]:
    result = yield_predictor.predict(
        request.crop_type,
        request.area_acres,
        request.rainfall_mm,
        request.fertilizer_kg,
    )
    firebase.save_event("yield_predictions", {**request.model_dump(), **result})
    return result


@app.get("/sustainability")
def sustainability() -> dict[str, Any]:
    return {
        "water_saved_liters": 12800,
        "chemical_reduction_percent": 34,
        "organic_recommendations": [
            "Use neem-based bio-pesticide for early pest pressure.",
            "Add compost or farmyard manure before sowing.",
            "Use mulching to reduce water loss.",
        ],
        "carbon_impact_kg_co2e_saved": 46,
        "green_farming_score": 87,
        "expert_warning": DISCLAIMER,
    }


def _validate_upload(upload: UploadFile) -> None:
    allowed = {"image/jpeg", "image/png", "image/jpg"}
    if upload.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Upload a JPG or PNG image.")
