from __future__ import annotations

import os
import time
from typing import Any

import requests


class WeatherService:
    def __init__(self) -> None:
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        self._cache: dict[str, tuple[float, dict[str, Any]]] = {}
        self.cache_seconds = int(os.getenv("WEATHER_CACHE_SECONDS", "300"))
        self.timeout_seconds = float(os.getenv("WEATHER_TIMEOUT_SECONDS", "3"))

    def current(self, lat: float | None = None, lon: float | None = None, city: str | None = None) -> dict[str, Any]:
        cache_key = self._cache_key(lat, lon, city)
        cached = self._cache.get(cache_key)
        if cached and time.time() - cached[0] < self.cache_seconds:
            return cached[1]
        if not self.api_key:
            return self._remember(cache_key, self._offline_weather(city))
        params: dict[str, Any] = {"appid": self.api_key, "units": "metric"}
        if lat is not None and lon is not None:
            params.update({"lat": lat, "lon": lon})
        elif city:
            params["q"] = city
        else:
            return self._remember(cache_key, self._offline_weather(city))
        try:
            response = requests.get(self.base_url, params=params, timeout=self.timeout_seconds)
            response.raise_for_status()
            data = response.json()
            weather = {
                "location": data.get("name") or city or "Current location",
                "temperature_c": round(data["main"]["temp"], 1),
                "humidity_percent": data["main"]["humidity"],
                "rainfall_mm": data.get("rain", {}).get("1h", 0),
                "wind_speed_mps": data.get("wind", {}).get("speed", 0),
                "source": "openweather",
            }
            weather["alerts"] = self.advisories(weather)
            return self._remember(cache_key, weather)
        except Exception:
            return self._remember(cache_key, self._offline_weather(city))

    def _cache_key(self, lat: float | None, lon: float | None, city: str | None) -> str:
        if lat is not None and lon is not None:
            return f"geo:{round(lat, 3)}:{round(lon, 3)}"
        return f"city:{(city or '').strip().lower()}"

    def _remember(self, key: str, weather: dict[str, Any]) -> dict[str, Any]:
        self._cache[key] = (time.time(), weather)
        return weather

    def advisories(self, weather: dict[str, Any]) -> list[str]:
        alerts: list[str] = []
        if weather.get("humidity_percent", 0) >= 80:
            alerts.append("High humidity increases fungal disease risk.")
        if weather.get("rainfall_mm", 0) > 0:
            alerts.append("Avoid spraying pesticide during rain or wet leaves.")
        if weather.get("temperature_c", 0) >= 38:
            alerts.append("Heat stress risk: irrigate during early morning or evening.")
        if weather.get("wind_speed_mps", 0) >= 8:
            alerts.append("High wind can cause pesticide drift; postpone spraying.")
        return alerts or ["Weather is suitable for routine field monitoring."]

    def _offline_weather(self, city: str | None) -> dict[str, Any]:
        weather = {
            "location": city or "Not detected",
            "temperature_c": 30.0,
            "humidity_percent": 65,
            "rainfall_mm": 0,
            "wind_speed_mps": 2.5,
            "source": "offline_default",
        }
        weather["alerts"] = self.advisories(weather)
        return weather
