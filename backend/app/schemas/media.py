"""
TrueSight Backend — Pydantic Schemas: Media
Models representing uploaded media files.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.analysis import MediaType


class MediaItem(BaseModel):
    """Represents a single uploaded media item stored in Supabase Storage."""

    id: UUID
    user_id: UUID
    analysis_id: Optional[UUID] = None

    filename: str
    original_filename: str
    content_type: str
    size_bytes: int
    media_type: MediaType

    # Supabase Storage path: media/{user_id}/{analysis_id}/{filename}
    storage_path: str

    # Signed URL is generated per-request; not stored permanently.
    signed_url: Optional[str] = None

    created_at: datetime


# ── Allowed file types ────────────────────────────────────────────────────────

ALLOWED_IMAGE_TYPES: frozenset[str] = frozenset(
    {"image/jpeg", "image/png", "image/webp", "image/gif"}
)

ALLOWED_AUDIO_TYPES: frozenset[str] = frozenset(
    {"audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/ogg"}
)

ALLOWED_VIDEO_TYPES: frozenset[str] = frozenset(
    {"video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"}
)

ALLOWED_EXTENSIONS: frozenset[str] = frozenset(
    {"jpg", "jpeg", "png", "webp", "gif", "mp3", "wav", "m4a", "ogg", "mp4", "mov", "webm", "avi"}
)

ALL_ALLOWED_CONTENT_TYPES: frozenset[str] = (
    ALLOWED_IMAGE_TYPES | ALLOWED_AUDIO_TYPES | ALLOWED_VIDEO_TYPES
)
