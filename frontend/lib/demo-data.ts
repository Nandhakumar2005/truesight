// ─── Shared demo data used by both the Analyze page and Report page ──────────
// Single source of truth — keeps Analyze ↔ Report consistent.

export type SignalLevel = "strong" | "low" | "moderate" | "high" | "inconclusive" | "weak";
export type Verdict = "authentic" | "suspicious" | "manipulated";
export type DemoKey = "authentic" | "manipulated" | "suspicious" | "audio-voice" | "video-news";

export interface Signal {
  label: string;
  level: SignalLevel;
  explanation: string;
}

export interface DemoResult {
  id: string;
  demoKey: DemoKey;
  score: number;
  verdict: Verdict;
  verdictLabel: string;
  confidence: "High" | "Medium" | "Low";
  filename: string;
  mediaType: string;
  date: string;
  summary: string;
  signals: Signal[];
}

export const DEMO_RESULTS: Record<DemoKey, DemoResult> = {
  authentic: {
    id: "demo-001",
    demoKey: "authentic",
    score: 92,
    verdict: "authentic",
    verdictLabel: "LIKELY AUTHENTIC",
    confidence: "High",
    filename: "vacation-photo.jpg",
    mediaType: "Image",
    date: "September 5, 2026",
    summary:
      "The image shows consistent visual characteristics with no obvious indicators of synthetic generation or significant manipulation. Available metadata also appears internally consistent. However, the original source could not be independently verified, so TrueSight cannot guarantee authenticity.",
    signals: [
      { label: "AI Generation",       level: "low",          explanation: "No strong visual indicators of synthetic generation were detected." },
      { label: "Manipulation",        level: "low",          explanation: "No obvious signs of significant image alteration were identified." },
      { label: "Metadata Integrity",  level: "strong",       explanation: "Available metadata appears internally consistent." },
      { label: "Visual Consistency",  level: "strong",       explanation: "Lighting, edges, textures and overall visual structure appear consistent." },
      { label: "Source Verification", level: "inconclusive", explanation: "The original source could not be independently verified." },
    ],
  },

  manipulated: {
    id: "demo-002",
    demoKey: "manipulated",
    score: 28,
    verdict: "manipulated",
    verdictLabel: "LIKELY MANIPULATED",
    confidence: "High",
    filename: "portrait-ai.png",
    mediaType: "Image",
    date: "September 4, 2026",
    summary:
      "Several visual signals suggest this image may have been synthetically generated or significantly altered. Fine details such as hair, skin texture and background edges show patterns sometimes associated with AI image generation. The metadata is sparse and does not correspond to the apparent origin.",
    signals: [
      { label: "AI Generation",       level: "high",         explanation: "Visual patterns in fine details and textures are consistent with signals sometimes seen in AI-generated images." },
      { label: "Manipulation",        level: "moderate",     explanation: "Certain edge regions and detail areas show potential inconsistencies that may indicate alteration." },
      { label: "Metadata Integrity",  level: "weak",         explanation: "Metadata is sparse and does not correspond to the claimed image origin." },
      { label: "Visual Consistency",  level: "moderate",     explanation: "Some areas of the image appear inconsistent in texture and lighting relative to the rest of the scene." },
      { label: "Source Verification", level: "inconclusive", explanation: "The original source could not be independently verified." },
    ],
  },

  suspicious: {
    id: "demo-003",
    demoKey: "suspicious",
    score: 41,
    verdict: "suspicious",
    verdictLabel: "SUSPICIOUS",
    confidence: "Medium",
    filename: "news-image.jpg",
    mediaType: "Image",
    date: "September 4, 2026",
    summary:
      "This image shows moderate signals that warrant caution before sharing. Certain regions exhibit visual inconsistencies, and the metadata shows irregularities. While TrueSight cannot confirm manipulation with certainty, the available signals suggest this image should be treated with skepticism.",
    signals: [
      { label: "AI Generation",       level: "moderate",     explanation: "Some regions exhibit visual characteristics that sometimes appear in AI-generated content." },
      { label: "Manipulation",        level: "high",         explanation: "Certain image regions show inconsistencies in lighting and texture that may indicate localized editing." },
      { label: "Metadata Integrity",  level: "moderate",     explanation: "Some metadata fields appear inconsistent with the apparent capture conditions." },
      { label: "Visual Consistency",  level: "weak",         explanation: "Background and foreground elements show inconsistent lighting and edge rendering." },
      { label: "Source Verification", level: "inconclusive", explanation: "The original source could not be independently verified." },
    ],
  },

  "audio-voice": {
    id: "demo-004",
    demoKey: "audio-voice",
    score: 64,
    verdict: "suspicious",
    verdictLabel: "SUSPICIOUS",
    confidence: "Medium",
    filename: "voice-sample.mp3",
    mediaType: "Audio",
    date: "September 5, 2026",
    summary:
      "The audio contains characteristics that may be consistent with synthetic or processed speech. The available metadata does not provide enough information to independently verify the original source. AI-assisted assessment based on available media signals.",
    signals: [
      { label: "Synthetic Voice",     level: "moderate",     explanation: "Certain spectral and prosodic patterns in the audio are sometimes associated with synthetic or AI-generated speech." },
      { label: "Audio Manipulation",  level: "moderate",     explanation: "Some segments show characteristics that may indicate post-processing or editing." },
      { label: "Metadata Integrity",  level: "inconclusive", explanation: "The available metadata does not provide sufficient information to verify the recording's provenance." },
      { label: "Speech Consistency",  level: "low",          explanation: "Overall speech rhythm and pacing appear largely consistent throughout the recording." },
      { label: "Source Verification", level: "inconclusive", explanation: "The original audio source could not be independently verified." },
    ],
  },

  "video-news": {
    id: "demo-005",
    demoKey: "video-news",
    score: 38,
    verdict: "manipulated",
    verdictLabel: "LIKELY MANIPULATED",
    confidence: "Medium",
    filename: "news-clip.mp4",
    mediaType: "Video",
    date: "September 5, 2026",
    summary:
      "The video contains visual and audio characteristics that may indicate editing or synthetic manipulation. Available metadata also provides limited provenance information. AI-assisted assessment based on available media signals.",
    signals: [
      { label: "AI Generation",             level: "moderate",     explanation: "Certain visual regions exhibit characteristics sometimes associated with AI-generated or synthetically enhanced video." },
      { label: "Visual Manipulation",        level: "high",         explanation: "Temporal inconsistencies between frames and visual artifacts suggest significant editing or compositing." },
      { label: "Audio/Visual Consistency",   level: "moderate",     explanation: "Audio and visual elements show some desynchronisation and inconsistencies that may indicate separate origins." },
      { label: "Metadata Integrity",         level: "weak",         explanation: "Video metadata is sparse and does not correspond to the apparent recording conditions." },
      { label: "Source Verification",        level: "inconclusive", explanation: "The original video source could not be independently verified." },
    ],
  },
};

// Map report URL IDs to demo keys
export const REPORT_ID_MAP: Record<string, DemoKey> = {
  "demo-001": "authentic",
  "demo-002": "manipulated",
  "demo-003": "suspicious",
  "demo-004": "audio-voice",
  "demo-005": "video-news",
};

export function getReportById(id: string): DemoResult {
  const key = REPORT_ID_MAP[id] ?? "authentic";
  return DEMO_RESULTS[key];
}

export const VERDICT_STYLES: Record<Verdict, {
  color: string; bg: string; border: string; ring: string;
}> = {
  authentic:  { color: "text-success",     bg: "bg-success/10",     border: "border-success/20",     ring: "stroke-success"     },
  suspicious: { color: "text-warning",     bg: "bg-warning/10",     border: "border-warning/20",     ring: "stroke-warning"     },
  manipulated:{ color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", ring: "stroke-destructive" },
};

export const SIGNAL_STYLES: Record<SignalLevel, {
  label: string; color: string; barColor: string; barWidth: string;
}> = {
  strong:       { label: "Strong",        color: "text-success",          barColor: "bg-success",      barWidth: "w-full" },
  low:          { label: "Low concern",   color: "text-success",          barColor: "bg-success",      barWidth: "w-1/5"  },
  moderate:     { label: "Moderate",      color: "text-warning",          barColor: "bg-warning",      barWidth: "w-3/5"  },
  high:         { label: "High concern",  color: "text-destructive",      barColor: "bg-destructive",  barWidth: "w-full" },
  inconclusive: { label: "Inconclusive",  color: "text-muted-foreground", barColor: "bg-muted",        barWidth: "w-2/5"  },
  weak:         { label: "Weak",          color: "text-destructive",      barColor: "bg-destructive",  barWidth: "w-4/5"  },
};
