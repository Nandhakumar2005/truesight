/**
 * TrueSight — TypeScript Types: Report
 * Represents shareable verification reports.
 */

import type { Analysis } from "./analysis";

export interface Report {
  id: string;
  analysisId: string;
  userId: string;
  title: string;
  /** URL-safe slug used in the public share URL: /report/{slug} */
  slug: string;
  isPublic: boolean;
  /** Populated when the report is fetched with its analysis data. */
  analysis?: Analysis;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReportInput {
  analysisId: string;
  title?: string;
  isPublic?: boolean;
}
