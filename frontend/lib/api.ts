/**
 * TrueSight — Centralized API Client
 *
 * All communication with the TrueSight FastAPI backend goes through this module.
 * Do NOT scatter fetch() calls throughout components.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const data = await api.get<HealthResponse>("/health");
 */

import { API_V1 } from "./constants";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export class TrueSightApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "TrueSightApiError";
    this.code = code;
    this.status = status;
  }
}

// ── Request helpers ───────────────────────────────────────────────────────────

interface RequestOptions {
  /** Bearer token for authenticated requests. */
  token?: string;
  signal?: AbortSignal;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_V1}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    let errorCode = "UNKNOWN_ERROR";
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      errorCode = errorBody.error?.code ?? errorCode;
      errorMessage = errorBody.error?.message ?? errorMessage;
    } catch {
      // Response body was not valid JSON — use defaults above.
    }

    throw new TrueSightApiError(errorCode, errorMessage, response.status);
  }

  // Handle empty responses (e.g., 204 No Content).
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

async function uploadFile<T>(
  path: string,
  formData: FormData,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_V1}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  // Do NOT set Content-Type for multipart — let the browser set it with the boundary.
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
    signal: options.signal,
  });

  if (!response.ok) {
    let errorCode = "UPLOAD_ERROR";
    let errorMessage = `Upload failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      errorCode = errorBody.error?.code ?? errorCode;
      errorMessage = errorBody.error?.message ?? errorMessage;
    } catch {
      // Ignore
    }

    throw new TrueSightApiError(errorCode, errorMessage, response.status);
  }

  return response.json() as Promise<T>;
}

// ── Public API object ─────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),

  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    uploadFile<T>(path, formData, options),
} as const;
