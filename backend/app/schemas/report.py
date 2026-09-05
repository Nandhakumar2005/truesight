"""
TrueSight Backend — Pydantic Schemas: Report
Models for shareable verification reports.
Full implementation in STEP 6.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.analysis import AnalysisResult


class ReportCreate(BaseModel):
    """Request body to generate a shareable report from an existing analysis."""

    analysis_id: UUID
    title: Optional[str] = Field(None, description="Optional custom report title")
    is_public: bool = Field(False, description="Whether the report can be viewed without auth")


class Report(BaseModel):
    """A shareable verification report wrapping an analysis result."""

    id: UUID
    analysis_id: UUID
    user_id: UUID

    title: str
    slug: str = Field(..., description="URL-safe identifier for public sharing")
    is_public: bool = False

    analysis: Optional[AnalysisResult] = None

    created_at: datetime
    updated_at: Optional[datetime] = None
