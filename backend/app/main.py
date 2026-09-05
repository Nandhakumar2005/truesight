"""
TrueSight Backend — FastAPI Application Entry Point
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.services.gemini_service import create_gemini_service

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize services on startup; clean up on shutdown."""
    settings = get_settings()

    logger.info("Starting TrueSight API v%s [%s]", settings.app_version, settings.app_env)

    # Initialize Gemini service and attach to app state.
    app.state.gemini_service = create_gemini_service(
        api_key=settings.gemini_api_key,
        model_name=settings.gemini_model,
    )

    if app.state.gemini_service.is_available:
        logger.info("Gemini service is available.")
    else:
        logger.warning(
            "Gemini service is NOT available. "
            "Set GEMINI_API_KEY to enable AI analysis."
        )

    yield  # ── Application runs here ──

    logger.info("TrueSight API shutting down.")


# ── Application factory ───────────────────────────────────────────────────────
def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "TrueSight — GenAI-powered media verification platform. "
            "Don't trust everything you see. Verify it with TrueSight."
        ),
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Never use allow_origins=["*"] in production.
    # Origins are read from FRONTEND_URL (comma-separated).
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "Accept"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(api_v1_router)

    # ── Global exception handler ──────────────────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled exception: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred. Please try again.",
                }
            },
        )

    return app


# ── Entry point ───────────────────────────────────────────────────────────────
app = create_app()
