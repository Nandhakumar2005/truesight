/**
 * TrueSight — TypeScript Types: Media
 * Represents uploaded media files and their metadata.
 */

/** Supported media types for analysis. */
export type MediaType = "IMAGE" | "AUDIO" | "VIDEO" | "URL";

/** Allowed file extensions per media type. */
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const;
export const ALLOWED_AUDIO_EXTENSIONS = ["mp3", "wav", "m4a", "ogg"] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "avi"] as const;

export type ImageExtension = (typeof ALLOWED_IMAGE_EXTENSIONS)[number];
export type AudioExtension = (typeof ALLOWED_AUDIO_EXTENSIONS)[number];
export type VideoExtension = (typeof ALLOWED_VIDEO_EXTENSIONS)[number];

/** Maximum allowed upload size: 50 MB. */
export const MAX_UPLOAD_SIZE_BYTES = 52_428_800;

/** A media item stored in Supabase Storage. */
export interface MediaItem {
  id: string;
  userId: string;
  analysisId: string | null;
  filename: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  mediaType: MediaType;
  storagePath: string;
  /** Signed URL generated per-request; not persisted. */
  signedUrl?: string;
  createdAt: string;
}

/** Helper to determine media type from a File object. */
export function inferMediaType(file: File): MediaType | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  if ((ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext)) return "IMAGE";
  if ((ALLOWED_AUDIO_EXTENSIONS as readonly string[]).includes(ext)) return "AUDIO";
  if ((ALLOWED_VIDEO_EXTENSIONS as readonly string[]).includes(ext)) return "VIDEO";
  return null;
}
