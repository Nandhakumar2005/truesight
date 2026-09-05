"""
TrueSight Backend — Core Configuration
Reads all settings from environment variables (or .env file).
"""
from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────
    app_name: str = "TrueSight API"
    app_version: str = "0.1.0"
    app_env: str = "development"

    # ── CORS ─────────────────────────────────────────────────────────────
    # Comma-separated list of allowed frontend origins.
    frontend_url: str = "http://localhost:3000"

    @property
    def allowed_origins(self) -> List[str]:
        """Parse comma-separated FRONTEND_URL into a list of allowed origins."""
        origins = [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]
        return origins or ["http://localhost:3000"]

    # ── Supabase ─────────────────────────────────────────────────────────
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # ── Gemini ───────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-pro"

    # ── Upload limits ────────────────────────────────────────────────────
    # Maximum allowed upload size in bytes (default 50 MB).
    max_upload_size_bytes: int = 52_428_800

    @property
    def is_development(self) -> bool:
        return self.app_env.lower() == "development"

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings singleton."""
    return Settings()
