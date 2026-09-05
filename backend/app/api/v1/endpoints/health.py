"""
TrueSight Backend — Health Endpoint
GET /api/v1/health
"""
from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns service health status. Used by Render and load balancers.",
    tags=["Health"],
)
async def health_check() -> HealthResponse:
    """Health check endpoint — must always return 200 OK when the service is running."""
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service="truesight-api",
        version=settings.app_version,
    )
