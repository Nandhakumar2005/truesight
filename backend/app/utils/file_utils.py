"""
TrueSight Backend — File Utilities
Helper functions for safe file handling and validation.
"""
from __future__ import annotations

import hashlib
import mimetypes
import os
import re
import uuid
from pathlib import Path

from app.schemas.media import (
    ALL_ALLOWED_CONTENT_TYPES,
    ALLOWED_EXTENSIONS,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_AUDIO_TYPES,
    ALLOWED_VIDEO_TYPES,
    MediaType,
)


def sanitize_filename(filename: str) -> str:
    """
    Return a safe filename: strip path components, remove dangerous chars,
    and preserve the extension.
    """
    # Take only the basename — never trust directory components.
    base = Path(filename).name
    # Replace anything that is not alphanumeric, dash, underscore, or dot.
    safe = re.sub(r"[^\w\-.]", "_", base)
    # Collapse multiple underscores/dots.
    safe = re.sub(r"_{2,}", "_", safe)
    return safe or "upload"


def generate_storage_path(user_id: str, analysis_id: str, filename: str) -> str:
    """
    Build the Supabase Storage path for a media file.
    Format: media/{user_id}/{analysis_id}/{filename}
    """
    safe_name = sanitize_filename(filename)
    return f"media/{user_id}/{analysis_id}/{safe_name}"


def infer_media_type(content_type: str) -> MediaType:
    """Infer MediaType enum from a MIME content type string."""
    if content_type in ALLOWED_IMAGE_TYPES:
        return MediaType.IMAGE
    if content_type in ALLOWED_AUDIO_TYPES:
        return MediaType.AUDIO
    if content_type in ALLOWED_VIDEO_TYPES:
        return MediaType.VIDEO
    return MediaType.IMAGE  # fallback


def validate_content_type(content_type: str) -> bool:
    """Return True if the content type is on the allowlist."""
    return content_type in ALL_ALLOWED_CONTENT_TYPES


def validate_extension(filename: str) -> bool:
    """Return True if the file extension is on the allowlist."""
    ext = Path(filename).suffix.lstrip(".").lower()
    return ext in ALLOWED_EXTENSIONS


def compute_sha256(data: bytes) -> str:
    """Compute SHA-256 hex digest of raw bytes."""
    return hashlib.sha256(data).hexdigest()
