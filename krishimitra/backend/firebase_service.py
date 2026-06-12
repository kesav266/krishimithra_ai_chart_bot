from __future__ import annotations

import json
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Any


class FirebaseService:
    def __init__(self) -> None:
        self.db = None
        self.executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="firebase-log")
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore

            if not firebase_admin._apps:
                raw = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
                if raw:
                    info = json.loads(raw)
                    cred = credentials.Certificate(info)
                    firebase_admin.initialize_app(cred)
                else:
                    project_id = os.getenv("FIREBASE_PROJECT_ID")
                    if project_id:
                        firebase_admin.initialize_app(options={"projectId": project_id})
            if firebase_admin._apps:
                self.db = firestore.client()
        except Exception:
            self.db = None

    def save_event(self, collection: str, payload: dict[str, Any]) -> None:
        if not self.db:
            return
        self.executor.submit(self._save_event, collection, payload)

    def _save_event(self, collection: str, payload: dict[str, Any]) -> None:
        payload = {**payload, "created_at": datetime.now(timezone.utc).isoformat()}
        try:
            self.db.collection(collection).add(payload)
        except Exception:
            return
