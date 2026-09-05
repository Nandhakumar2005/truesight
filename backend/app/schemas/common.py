"""
TrueSight Backend — Pydantic Schemas: Common
Shared response envelopes and error structures.
"""
from __future__ import annotations

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class ErrorDetail(BaseModel):
    """Standard error detail object."""

    code: str
    message: str


class ErrorResponse(BaseModel):
    """Top-level error envelope returned by all error responses."""

    error: ErrorDetail


class DataResponse(BaseModel, Generic[DataT]):
    """Generic success envelope wrapping any data payload."""

    data: DataT
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Response for the health check endpoint."""

    status: str
    service: str
    version: str
