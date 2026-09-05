"""
TrueSight Backend — Security Utilities
JWT verification and request authentication helpers.
Full implementation in STEP 3 (Authentication).
"""
from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, Request, status


def get_token_from_request(request: Request) -> Optional[str]:
    """
    Extract a Bearer token from the Authorization header.
    Returns None if the header is absent.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token


def require_auth(request: Request) -> str:
    """
    Dependency: Require a valid Bearer token.
    Raises 401 if absent.
    Full JWT validation will be added in STEP 3.
    """
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # TODO (STEP 3): Validate token against Supabase JWT secret.
    return token
