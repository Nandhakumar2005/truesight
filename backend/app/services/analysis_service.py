"""
TrueSight Backend — Analysis Service
Orchestrates the full analysis pipeline.
Full implementation in STEP 5.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from app.schemas.analysis import (
    AnalysisResult,
    AnalysisStatus,
    MediaType,
    Verdict,
)
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)


class AnalysisService:
    """
    Orchestrates the complete media analysis pipeline:

    1. File validation (content type, size, extension)
    2. Metadata extraction
    3. AI analysis via GeminiService
    4. Signal generation
    5. Authenticity score calculation
    6. Result persistence to Supabase
    7. Report generation (STEP 6)

    This service coordinates all other services and is the primary
    entry point for analysis requests from the API layer.
    """

    def __init__(self, gemini_service: GeminiService) -> None:
        self._gemini = gemini_service

    async def create_pending_analysis(
        self,
        media_type: MediaType,
        filename: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> AnalysisResult:
        """
        Create a PENDING analysis record before processing begins.
        In STEP 5, this will persist to Supabase and return the DB record.
        """
        # TODO (STEP 5): Persist to Supabase and return real DB record.
        return AnalysisResult(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id) if user_id else None,
            media_type=media_type,
            filename=filename,
            status=AnalysisStatus.PENDING,
            created_at=datetime.now(timezone.utc),
        )

    async def analyze_file(
        self,
        file_bytes: bytes,
        content_type: str,
        filename: str,
        user_id: Optional[str] = None,
    ) -> AnalysisResult:
        """
        Full file analysis pipeline.
        To be fully implemented in STEP 5.
        """
        # TODO (STEP 5): Implement full pipeline.
        raise NotImplementedError("File analysis pipeline implemented in STEP 5.")

    async def analyze_url(
        self,
        url: str,
        user_id: Optional[str] = None,
    ) -> AnalysisResult:
        """
        URL-based analysis pipeline.
        SSRF protection required before enabling in production.
        To be fully implemented in STEP 5.
        """
        # TODO (STEP 5): Implement URL analysis with SSRF protection.
        raise NotImplementedError("URL analysis pipeline implemented in STEP 5.")

    async def get_analysis(self, analysis_id: str, user_id: str) -> Optional[AnalysisResult]:
        """
        Retrieve an analysis by ID, enforcing user ownership.
        To be fully implemented in STEP 5.
        """
        # TODO (STEP 5): Fetch from Supabase with RLS enforcement.
        raise NotImplementedError("Analysis retrieval implemented in STEP 5.")

    async def list_analyses(
        self, user_id: str, page: int = 1, page_size: int = 20
    ) -> list[AnalysisResult]:
        """
        List all analyses belonging to a user.
        To be fully implemented in STEP 5.
        """
        # TODO (STEP 5): Fetch from Supabase.
        raise NotImplementedError("Analysis listing implemented in STEP 5.")


def create_analysis_service(gemini_service: GeminiService) -> AnalysisService:
    """Factory function for AnalysisService."""
    return AnalysisService(gemini_service=gemini_service)
