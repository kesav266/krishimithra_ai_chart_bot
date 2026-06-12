# KrishiMitra AI

Smart Crop Doctor and Sustainable Farming Assistant for Indian farmers.

KrishiMitra AI is a mobile-first PWA with a FastAPI backend. It supports crop disease scans, pest scans, weather-aware recommendations, soil health advice, yield prediction, multilingual AI chat, RAG sources, sustainability metrics, geolocation, voice input, and expert safety warnings.

## Features

- Crop disease image detection with YOLOv8 model loading and image-triage fallback.
- Pest image detection for whitefly, bollworm, aphids, and thrips.
- OpenWeather advisory rules for humidity, rain, wind, and heat.
- Gemini 2.5 Flash advisory and farmer chat responses.
- FAISS + Sentence Transformers RAG over `data/agricultural_knowledge`.
- Soil NPK/pH analysis from manual input or PDF extraction.
- XGBoost yield model loading with agronomic fallback.
- Firebase Firestore event logging when credentials are configured.
- English, Hindi, and Telugu UI and AI response support.
- PWA manifest, service worker, camera upload, geolocation, speech-to-text, and text-to-speech.

## Project Structure

```text
krishimitra-ai/
  frontend/
    index.html
    style.css
    app.js
    manifest.json
    sw.js
  backend/
    main.py
    disease_detector.py
    pest_detector.py
    weather_service.py
    ai_advisor.py
    rag_service.py
    soil_advisor.py
    yield_predictor.py
    translation_service.py
    firebase_service.py
    requirements.txt
  models/
    crop_disease_yolov8.pt
    pest_detection_yolov8.pt
    yield_prediction.pkl
  data/
    agricultural_knowledge/
```

## Environment

Copy `.env.example` to `.env` and set:

```text
GEMINI_API_KEY=your_gemini_api_key
ENABLE_GEMINI_ADVICE=false
ENABLE_GEMINI_CHAT=false
ENABLE_GEMINI_TRANSLATION=false
ENABLE_VECTOR_RAG=false
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHER_TIMEOUT_SECONDS=3
WEATHER_CACHE_SECONDS=300
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
```

API keys are never hardcoded. If a key or model is missing, the backend returns a safe fallback response so the demo remains usable.
For the fastest user experience, keep the optional Gemini and vector RAG flags disabled. Turn them on only when you want cloud-generated answers or embedding search and can accept the extra wait time.

## Local Install

Use Python 3.11 for the backend. The ML stack includes Ultralytics, FAISS, and XGBoost, which may not provide wheels for every newest Python release.

```bash
cd krishimitra-ai/backend
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open `frontend/index.html` in a browser, or serve it from any static server. In Settings, keep the backend URL as `http://localhost:8000`.

## Models

Place trained model files in `krishimitra-ai/models/`:

- `crop_disease_yolov8.pt`
- `pest_detection_yolov8.pt`
- `yield_prediction.pkl`

The YOLOv8 detectors use Ultralytics when the `.pt` files exist. The yield predictor uses `joblib` to load the trained XGBoost/scikit-learn pipeline.

## API Routes

- `GET /health`
- `POST /detect/disease`
- `POST /detect/pest`
- `POST /weather`
- `POST /advisor`
- `POST /chat`
- `POST /rag/query`
- `POST /soil/analyze`
- `POST /yield/predict`
- `GET /sustainability`

## Deployment

### Backend on Render

1. Create a Render Web Service from the repository.
2. Set root directory to `krishimitra-ai/backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Render will read `runtime.txt` and use Python 3.11.
6. Add environment variables from `.env.example`.
7. Upload model files through persistent storage or bake them into the deployment artifact.

### Frontend on Vercel

1. Create a Vercel project.
2. Set root directory to `krishimitra-ai/frontend`.
3. Use static deployment defaults.
4. After deployment, open Settings in the app and set the Render backend URL.

## Safety

Every diagnosis and recommendation includes an expert warning. Farmers should consult an agricultural officer or KVK when disease spreads quickly, pest infestation is severe, or more than 30 percent of the field is affected.
