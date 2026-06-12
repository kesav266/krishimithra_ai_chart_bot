from __future__ import annotations

import os
from pathlib import Path
from typing import Any


class RAGService:
    def __init__(self, data_dir: str = "../data/agricultural_knowledge") -> None:
        self.data_dir = Path(__file__).resolve().parent.joinpath(data_dir).resolve()
        self.documents: list[dict[str, str]] = []
        self.index = None
        self.encoder = None
        self._load_documents()
        self._build_index()

    def _load_documents(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        for path in self.data_dir.glob("**/*.txt"):
            text = path.read_text(encoding="utf-8", errors="ignore").strip()
            if text:
                self.documents.append({"source": path.name, "text": text[:4000]})
        if not self.documents:
            self.documents = [
                {
                    "source": "general_ipm_guidance",
                    "text": "Use integrated pest management: field scouting, resistant varieties, crop rotation, biological control, and need-based pesticide application.",
                },
                {
                    "source": "soil_health_basics",
                    "text": "Maintain soil health with organic matter, balanced NPK, pH correction, mulching, green manure, and soil-test based fertilizer application.",
                },
            ]

    def _build_index(self) -> None:
        if os.getenv("ENABLE_VECTOR_RAG", "").lower() != "true":
            self.index = None
            self.encoder = None
            return
        try:
            import faiss
            from sentence_transformers import SentenceTransformer

            self.encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            vectors = self.encoder.encode([doc["text"] for doc in self.documents], normalize_embeddings=True)
            self.index = faiss.IndexFlatIP(vectors.shape[1])
            self.index.add(vectors)
        except Exception:
            self.index = None
            self.encoder = None

    def retrieve(self, query: str, top_k: int = 3) -> dict[str, Any]:
        if self.index and self.encoder:
            vectors = self.encoder.encode([query], normalize_embeddings=True)
            scores, ids = self.index.search(vectors, min(top_k, len(self.documents)))
            docs = [
                {
                    "source": self.documents[int(idx)]["source"],
                    "snippet": self.documents[int(idx)]["text"][:700],
                    "score": round(float(score), 3),
                }
                for score, idx in zip(scores[0], ids[0])
                if idx >= 0
            ]
            return {"query": query, "sources_used": docs}
        query_terms = set(query.lower().split())
        ranked = sorted(
            self.documents,
            key=lambda doc: len(query_terms.intersection(doc["text"].lower().split())),
            reverse=True,
        )
        return {
            "query": query,
            "sources_used": [{"source": doc["source"], "snippet": doc["text"][:700], "score": None} for doc in ranked[:top_k]],
        }
