"""
TrueSight Backend — API v1 Router
Aggregates all v1 endpoint routers.
New endpoint routers are registered here as features are added.
"""
from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import health

# ── v1 root router ────────────────────────────────────────────────────────────
api_v1_router = APIRouter(prefix="/api/v1")

# ── Registered endpoints ──────────────────────────────────────────────────────
api_v1_router.include_router(health.router)

# Future routers (registered in STEP 5+):
# from app.api.v1.endpoints import analyze, analyses, reports
# api_v1_router.include_router(analyze.router,    prefix="/analyze",   tags=["Analysis"])
# api_v1_router.include_router(analyses.router,   prefix="/analyses",  tags=["Analyses"])
# api_v1_router.include_router(reports.router,    prefix="/reports",   tags=["Reports"])
