/**
 * TrueSight — Utility Functions
 * Small, pure helper functions used throughout the frontend.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merging ────────────────────────────────────────────────────

/**
 * Merge Tailwind CSS class names intelligently.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Formatting ────────────────────────────────────────────────────────────────

/** Format a file size in bytes to a human-readable string. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** Format a date string to a localized human-readable format. */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/** Format a date string to include time. */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Validation ────────────────────────────────────────────────────────────────

/** Return true if the string is a valid http/https URL. */
export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// ── Misc ──────────────────────────────────────────────────────────────────────

/** Return a truncated version of a string with an ellipsis. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/** Generate a random slug (for report sharing). */
export function generateSlug(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
