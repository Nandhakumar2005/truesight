/**
 * TrueSight — TypeScript Types: Analysis
 * Core types for media analysis results, signals, and scoring.
 *
 * IMPORTANT: The authenticity score is an AI-assisted estimate.
 * It is NOT a scientific certainty and should never be presented as such.
 */

import type { MediaType } from "./media";

// ── Enumerations ──────────────────────────────────────────────────────────────

export type AnalysisStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

/**
 * Overall verdict on the media's authenticity.
 * These should always be presented with appropriate caveats.
 */
export type Verdict =
  | "LIKELY_AUTHENTIC"
  | "SUSPICIOUS"
  | "LIKELY_MANIPULATED"
  | "INCONCLUSIVE";

export type SignalStatus = "positive" | "negative" | "neutral";
export type SignalSeverity = "low" | "medium" | "high";
export type SignalCategory =
  | "visual"
  | "audio"
  | "metadata"
  | "temporal"
  | "ai_pattern"
  | "provenance";

// ── Signal ────────────────────────────────────────────────────────────────────

/**
 * A single detection signal contributing to the overall assessment.
 * Each signal represents one observable characteristic of the media.
 */
export interface AnalysisSignal {
  name: string;
  category: SignalCategory;
  /** positive = supports authenticity, negative = suggests manipulation */
  status: SignalStatus;
  /** Plain-language explanation shown directly to the user. */
  explanation: string;
  severity: SignalSeverity;
}

// ── Analysis Result ───────────────────────────────────────────────────────────

/**
 * The complete result of a single analysis.
 *
 * authenticityScore: 0 (highly suspicious) → 100 (highly authentic).
 * This is an AI-assisted estimate, NOT a scientific fact.
 */
export interface Analysis {
  id: string;
  userId: string | null;
  mediaType: MediaType;
  filename: string | null;
  fileUrl: string | null;
  status: AnalysisStatus;

  /**
   * AI-assisted authenticity estimate (0–100).
   * Lower values indicate higher suspicion of manipulation.
   * Present with appropriate uncertainty language.
   */
  authenticityScore: number | null;
  verdict: Verdict | null;
  /** Model confidence in its assessment (0–1). */
  confidence: number | null;
  /** Plain-language summary for the user. */
  summary: string | null;
  signals: AnalysisSignal[] | null;
  /** Raw technical metadata extracted from the file. */
  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Human-readable verdict labels. */
export const VERDICT_LABELS: Record<Verdict, string> = {
  LIKELY_AUTHENTIC: "Likely Authentic",
  SUSPICIOUS: "Suspicious",
  LIKELY_MANIPULATED: "Likely Manipulated",
  INCONCLUSIVE: "Inconclusive",
};

/** Returns a color semantic for a given verdict (for UI use). */
export function getVerdictColor(verdict: Verdict): "green" | "yellow" | "red" | "gray" {
  switch (verdict) {
    case "LIKELY_AUTHENTIC":
      return "green";
    case "SUSPICIOUS":
      return "yellow";
    case "LIKELY_MANIPULATED":
      return "red";
    case "INCONCLUSIVE":
      return "gray";
  }
}

/** Converts an authenticity score to a human-readable tier label. */
export function getScoreTier(score: number): string {
  if (score >= 80) return "High Authenticity";
  if (score >= 60) return "Moderate Authenticity";
  if (score >= 40) return "Low Authenticity";
  return "Highly Suspicious";
}
