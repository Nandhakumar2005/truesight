"""
TrueSight Backend — Pydantic Schemas: Analysis
Request and response models for analysis endpoints.
Full implementation in STEP 5.
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ── Enumerations ──────────────────────────────────────────────────────────────

class MediaType(str, Enum):
    IMAGE = "IMAGE"
    AUDIO = "AUDIO"
    VIDEO = "VIDEO"
    URL = "URL"


class AnalysisStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Verdict(str, Enum):
    LIKELY_AUTHENTIC = "LIKELY_AUTHENTIC"
    SUSPICIOUS = "SUSPICIOUS"
    LIKELY_MANIPULATED = "LIKELY_MANIPULATED"
    INCONCLUSIVE = "INCONCLUSIVE"


class SignalStatus(str, Enum):
    POSITIVE = "positive"    # Supports authenticity
    NEGATIVE = "negative"    # Suggests manipulation
    NEUTRAL = "neutral"      # No strong signal


class SignalSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class SignalCategory(str, Enum):
    VISUAL = "visual"
    AUDIO = "audio"
    METADATA = "metadata"
    TEMPORAL = "temporal"
    AI_PATTERN = "ai_pattern"
    PROVENANCE = "provenance"


# ── Signal ────────────────────────────────────────────────────────────────────

class AnalysisSignal(BaseModel):
    """
    A single detection signal contributing to the overall assessment.
    Each signal represents one observable characteristic of the media.
    """

    name: str = Field(..., description="Human-readable signal name")
    category: SignalCategory
    status: SignalStatus
    explanation: str = Field(..., description="Plain-language explanation for the user")
    severity: SignalSeverity = SignalSeverity.LOW


# ── Request Schemas ───────────────────────────────────────────────────────────

class AnalyzeUrlRequest(BaseModel):
    """Request body for URL-based analysis."""

    url: str = Field(..., description="The URL of the media to analyze")
    media_type: Optional[MediaType] = Field(
        None,
        description="Optional hint about the media type; will be inferred if not provided",
    )


# ── Response Schemas ──────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    """
    The complete result of a single analysis.
    Authenticity score is AI-assisted and should NOT be treated as definitive truth.
    """

    id: UUID
    user_id: Optional[UUID] = None
    media_type: MediaType
    filename: Optional[str] = None
    file_url: Optional[str] = None
    status: AnalysisStatus

    # Score: 0 (highly suspicious) → 100 (highly authentic).
    # This is an AI-assisted estimate, not a scientific certainty.
    authenticity_score: Optional[float] = Field(
        None, ge=0, le=100, description="AI-assisted authenticity estimate (0–100)"
    )
    verdict: Optional[Verdict] = None
    confidence: Optional[float] = Field(None, ge=0, le=1, description="Model confidence (0–1)")
    summary: Optional[str] = Field(None, description="Plain-language summary for the user")
    signals: Optional[List[AnalysisSignal]] = None
    metadata: Optional[Dict[str, Any]] = Field(
        None, description="Raw technical metadata extracted from the file"
    )
    created_at: datetime
    updated_at: Optional[datetime] = None


class AnalysisListResponse(BaseModel):
    """Paginated list of analyses."""

    items: List[AnalysisResult]
    total: int
    page: int = 1
    page_size: int = 20
