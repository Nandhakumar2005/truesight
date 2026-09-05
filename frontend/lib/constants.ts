/**
 * TrueSight — Application Constants
 * Centralized place for magic strings, limits, and config values.
 */

// ── App ───────────────────────────────────────────────────────────────────────
export const APP_NAME = "TrueSight" as const;
export const APP_TAGLINE = "Don't trust everything you see. Verify it with TrueSight." as const;
export const APP_DESCRIPTION =
  "GenAI-powered media verification platform for everyday users." as const;

// ── API ───────────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const API_V1 = `${API_BASE_URL}/api/v1` as const;

// ── Upload limits ─────────────────────────────────────────────────────────────
/** 50 MB — must match backend MAX_UPLOAD_SIZE_BYTES */
export const MAX_UPLOAD_SIZE_BYTES = 52_428_800;
export const MAX_UPLOAD_SIZE_LABEL = "50 MB";

// ── Routes ────────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ANALYZE: "/analyze",
  REPORT: (id: string) => `/report/${id}`,
} as const;

// ── Analysis ──────────────────────────────────────────────────────────────────
export const SCORE_DISCLAIMER =
  "This is an AI-assisted assessment based on available media signals. " +
  "It is not a scientific fact and should not be used as the sole basis for any decision.";

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
