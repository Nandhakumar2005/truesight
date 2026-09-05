"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Image as ImageIcon,
  Mic,
  Video,
  Link2,
  X,
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  FileText,
  Share2,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DEMO_RESULTS,
  VERDICT_STYLES,
  SIGNAL_STYLES,
  type DemoKey,
  type DemoResult,
  type Signal,
} from "@/lib/demo-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaTab = "image" | "audio" | "video" | "url";

const SCAN_STAGES: Record<MediaTab, string[]> = {
  image: [
    "File received",
    "Inspecting visual signals",
    "Checking metadata",
    "Assessing manipulation indicators",
    "Generating authenticity assessment",
  ],
  audio: [
    "File received",
    "Inspecting audio characteristics",
    "Checking available metadata",
    "Assessing synthetic/manipulation indicators",
    "Generating authenticity assessment",
  ],
  video: [
    "File received",
    "Inspecting video frames",
    "Checking available metadata",
    "Assessing visual consistency",
    "Assessing audio/visual consistency",
    "Generating authenticity assessment",
  ],
  url: [
    "Fetching URL content",
    "Extracting media and text",
    "Analyzing text structure",
    "Assessing image/text consistency",
    "Generating authenticity assessment",
  ],
};

// Default demo key when user uploads a real file (no demo selected)
const DEFAULT_DEMO_KEY: Record<MediaTab, DemoKey> = {
  image: "authentic",
  audio: "audio-voice",
  video: "video-news",
  url: "url-article",
};

// Accepted MIME type groups
const ACCEPTED_TYPES: Record<MediaTab, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/ogg", "audio/mp4", "audio/m4a", "audio/aac", "audio/flac"],
  video: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/avi"],
  url: [],
};

const ACCEPT_ATTR: Record<MediaTab, string> = {
  image: "image/*",
  audio: "audio/*",
  video: "video/*",
  url: "",
};

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

// ─── Demo case cards ──────────────────────────────────────────────────────────

const DEMO_CASES: Array<{
  key: DemoKey;
  title: string;
  description: string;
  gradient: string;
  icon: React.ElementType;
  iconColor: string;
  tab: MediaTab;
}> = [
  {
    key: "authentic",
    tab: "image",
    title: "Authentic Photograph",
    description: "A real-world photograph with consistent metadata and visual signals.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
  },
  {
    key: "manipulated",
    tab: "image",
    title: "AI-Generated Portrait",
    description: "A synthetically generated portrait with inconsistent visual detail.",
    gradient: "from-red-500/20 to-rose-500/10",
    icon: ShieldAlert,
    iconColor: "text-red-400",
  },
  {
    key: "suspicious",
    tab: "image",
    title: "Manipulated Image",
    description: "An image showing signs of localized editing and metadata irregularities.",
    gradient: "from-amber-500/20 to-orange-500/10",
    icon: Shield,
    iconColor: "text-amber-400",
  },
  {
    key: "audio-voice",
    tab: "audio",
    title: "AI Voice Sample",
    description: "Audio exhibiting characteristics consistent with synthetic speech generation.",
    gradient: "from-violet-500/20 to-purple-500/10",
    icon: Mic,
    iconColor: "text-violet-400",
  },
  {
    key: "video-news",
    tab: "video",
    title: "Manipulated News Clip",
    description: "A video showing visual and audio inconsistencies suggesting significant editing.",
    gradient: "from-rose-500/20 to-pink-500/10",
    icon: Video,
    iconColor: "text-rose-400",
  },
  {
    key: "url-article",
    tab: "url",
    title: "Suspicious News Article",
    description: "A URL pointing to an article with mixed authenticity signals and potentially synthetic content.",
    gradient: "from-amber-500/20 to-yellow-500/10",
    icon: Link2,
    iconColor: "text-amber-400",
  },
];

// ─── ScoreRing ────────────────────────────────────────────────────────────────

function ScoreRing({ score, verdict }: { score: number; verdict: DemoResult["verdict"] }) {
  const vs = VERDICT_STYLES[verdict];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" className="stroke-muted fill-none" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54"
          className={cn("fill-none", vs.ring)}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}

// ─── SignalRow ────────────────────────────────────────────────────────────────

function SignalRow({ signal, index }: { signal: Signal; index: number }) {
  const ss = SIGNAL_STYLES[signal.level];
  const iconMap: Record<string, React.ElementType> = {
    "text-success": CheckCircle2,
    "text-warning": AlertTriangle,
    "text-destructive": XCircle,
    "text-muted-foreground": HelpCircle,
  };
  const Icon = iconMap[ss.color] ?? HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index + 0.4 }}
      className="p-4 rounded-xl bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4 flex-shrink-0", ss.color)} />
          <span className="text-sm font-semibold text-foreground">{signal.label}</span>
        </div>
        <span className={cn("text-xs font-semibold whitespace-nowrap", ss.color)}>{ss.label}</span>
      </div>
      <div className="w-full h-1 bg-muted rounded-full mb-2 overflow-hidden">
        <div className={cn("h-full rounded-full", ss.barColor, ss.barWidth)} />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{signal.explanation}</p>
    </motion.div>
  );
}

// ─── ScanAnimation ────────────────────────────────────────────────────────────

function ScanAnimation({ stages, onComplete }: { stages: string[]; onComplete: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    let current = 0;
    const advance = () => {
      if (current < stages.length - 1) {
        current++;
        setCompleted((c) => [...c, current - 1]);
        setStageIndex(current);
        setTimeout(advance, current === stages.length - 1 ? 900 : 480);
      } else {
        setCompleted((c) => [...c, current]);
        setTimeout(onComplete, 600);
      }
    };
    const t = setTimeout(advance, 500);
    return () => clearTimeout(t);
  }, [onComplete, stages]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="glass-panel rounded-2xl border border-primary/20 p-8 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <ScanSearch className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Analyzing media…</p>
          <p className="text-xs text-muted-foreground">AI-assisted verification in progress</p>
        </div>
        <div className="ml-auto">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <ul className="space-y-3">
        {stages.map((stage, i) => {
          const done = completed.includes(i);
          const active = i === stageIndex && !done;
          return (
            <li key={stage} className="flex items-center gap-3 text-sm">
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              ) : active ? (
                <span className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <span className="animate-ping absolute h-3 w-3 rounded-full bg-primary/40" />
                  <span className="relative h-2 w-2 rounded-full bg-primary" />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0" />
              )}
              <span className={cn(
                done ? "text-foreground/60" :
                active ? "text-foreground font-medium" :
                "text-muted-foreground/40"
              )}>
                {stage}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

// ─── AnalysisResult ───────────────────────────────────────────────────────────

function AnalysisResult({
  result,
  imageUrl,
  audioUrl,
  videoUrl,
  urlValue,
  onReset,
}: {
  result: DemoResult;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  urlValue: string | null;
  onReset: () => void;
}) {
  const vs = VERDICT_STYLES[result.verdict];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/report/${result.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const VerdictIcon = result.verdict === "authentic" ? CheckCircle2
    : result.verdict === "suspicious" ? AlertTriangle : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Score + summary card */}
      <div className="glass-panel rounded-2xl border border-border p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Score ring */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <ScoreRing score={result.score} verdict={result.verdict} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold",
                vs.bg, vs.color, vs.border
              )}
            >
              <VerdictIcon className="w-4 h-4" />
              {result.verdictLabel}
            </motion.div>
            <span className="text-xs text-muted-foreground">
              Confidence: <span className="font-medium text-foreground">{result.confidence}</span>
            </span>
          </div>

          {/* Summary */}
          <div className="flex-grow min-w-0">
            <h2 className="text-xl font-bold text-foreground mb-1">Authenticity Assessment</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4">
              AI-assisted · Analysis complete
            </p>

            {/* Media preview */}
            {imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border h-32 bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Analyzed media" className="w-full h-full object-cover" />
              </div>
            )}
            {audioUrl && (
              <div className="mb-4 rounded-xl border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground truncate">{result.filename}</span>
                </div>
                <audio controls className="w-full h-8" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {videoUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border bg-muted/30">
                <video controls className="w-full max-h-40 object-contain" src={videoUrl}>
                  Your browser does not support the video element.
                </video>
              </div>
            )}
            {urlValue && (
              <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">Analyzed URL</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{urlValue}</p>
              </div>
            )}

            <div className="bg-muted/20 border border-border rounded-xl p-4 mb-3">
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                Why TrueSight reached this assessment
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              AI-assisted assessment based on available media signals. Results are not a definitive determination of authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Signal breakdown */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Signal Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {result.signals.map((signal, i) => (
            <SignalRow key={signal.label} signal={signal} index={i} />
          ))}
        </div>

        {/* Methodology / Disclaimer */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Why should I trust this result?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            TrueSight considers available signals such as visual/audio characteristics, metadata, consistency checks, and source information. This is an <strong>AI-assisted assessment</strong>, not a definitive guarantee of authenticity.
          </p>
          <div className="flex gap-2 bg-warning/5 border border-warning/15 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Always apply critical judgment before acting on or sharing sensitive media.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href={`/report/${result.id}`} className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 group">
            <FileText className="w-4 h-4 mr-2" />
            View Full Report
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 h-11 border-border hover:bg-muted/50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className={cn(
            "h-11 border-border hover:bg-muted/50 transition-all",
            copied && "border-success/40 bg-success/5 text-success"
          )}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {copied ? "Link copied!" : "Share Report"}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Upload zone helpers ──────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main AnalyzerClient ──────────────────────────────────────────────────────

export function AnalyzerClient() {
  const [tab, setTab] = useState<MediaTab>("image");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaTab>("image"); // which tab the current file belongs to
  const [phase, setPhase] = useState<"idle" | "scanning" | "result">("idle");
  const [activeResult, setActiveResult] = useState<DemoResult | null>(null);
  const [activeDemoKey, setActiveDemoKey] = useState<DemoKey | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const TABS: { key: MediaTab; label: string; icon: React.ElementType }[] = [
    { key: "image", label: "Image", icon: ImageIcon },
    { key: "audio", label: "Audio", icon: Mic },
    { key: "video", label: "Video", icon: Video },
    { key: "url", label: "URL", icon: Link2 },
  ];

  // ── helpers ──

  const revokePreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const clearMedia = useCallback(() => {
    revokePreview();
    setFile(null);
    setPreviewUrl(null);
    setUrlInput("");
    setActiveDemoKey(null);
    setPhase("idle");
    setActiveResult(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [revokePreview]);

  // Clear file when switching tabs so the upload zone resets
  const handleTabChange = (newTab: MediaTab) => {
    clearMedia();
    setTab(newTab);
  };

  const validateFile = (f: File, forTab: MediaTab): string | null => {
    if (f.size > MAX_FILE_BYTES) return "File is too large. Please choose a file under 100 MB.";
    const accepted = ACCEPTED_TYPES[forTab];
    // Some browsers report empty MIME for certain formats; allow if starts with the right category
    const mime = f.type.toLowerCase();
    const category = forTab; // "image" | "audio" | "video"
    if (!mime.startsWith(category + "/") && !accepted.includes(mime)) {
      return "Unsupported file type. Please choose a supported image, audio, or video file.";
    }
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f, tab);
    if (err) {
      setFileError(err);
      return;
    }
    revokePreview();
    setFileError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setMediaKind(tab);
    setActiveDemoKey(null);
    setPhase("idle");
    setActiveResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, revokePreview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDemoCase = (demo: typeof DEMO_CASES[number]) => {
    revokePreview();
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setActiveDemoKey(demo.key);
    setMediaKind(demo.tab);
    setTab(demo.tab);
    setPhase("idle");
    setActiveResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!file && !activeDemoKey && !urlInput.trim()) return;
    if (tab === "url" && urlInput.trim() && !activeDemoKey) {
      if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
        setFileError("Please enter a valid URL starting with http:// or https://");
        return;
      }
      setMediaKind("url");
      setFileError(null);
    }
    setPhase("scanning");
  };

  const handleScanComplete = useCallback(() => {
    let key: DemoKey;
    if (activeDemoKey) {
      key = activeDemoKey;
    } else {
      key = DEFAULT_DEMO_KEY[mediaKind];
    }
    setActiveResult(DEMO_RESULTS[key]);
    setPhase("result");
  }, [activeDemoKey, mediaKind]);

  const hasMedia = file !== null || activeDemoKey !== null || urlInput.trim() !== "";

  // Derived URLs for result
  const imageUrl = mediaKind === "image" ? previewUrl : null;
  const audioUrl = mediaKind === "audio" ? previewUrl : null;
  const videoUrl = mediaKind === "video" ? previewUrl : null;
  const activeUrlValue = mediaKind === "url" ? urlInput : null;

  // Current stages for ScanAnimation
  const currentStages = SCAN_STAGES[mediaKind];

  // ── Upload zone shared wrapper ──
  const uploadZoneClass = (hasFile: boolean) => cn(
    "relative rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[260px] flex items-center justify-center overflow-hidden",
    hasFile ? "border-primary/30 cursor-default" : "cursor-pointer hover:border-primary/50",
    dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border"
  );

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop: handleDrop,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <motion.div
            key="idle-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Tab bar */}
            <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-border w-fit">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    tab === t.key
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── IMAGE upload zone ── */}
            {tab === "image" && (
              <div
                {...dropHandlers}
                onClick={() => !previewUrl && inputRef.current?.click()}
                className={uploadZoneClass(!!previewUrl)}
              >
                {!previewUrl ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center select-none">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-colors",
                      dragging ? "bg-primary/10 border-primary/40" : "bg-muted/50 border-border"
                    )}>
                      <Upload className={cn("w-7 h-7 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">
                      {dragging ? "Drop to upload" : "Drop an image here or browse files"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WEBP, GIF · Max 100 MB
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full min-h-[260px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain max-h-[380px]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs font-medium text-foreground truncate max-w-[200px]">{file?.name}</p>
                          {file && <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearMedia(); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/80 hover:bg-muted rounded-lg border border-border transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTR.image}
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* ── AUDIO upload zone ── */}
            {tab === "audio" && (
              <div
                {...(!previewUrl ? dropHandlers : {})}
                onClick={() => !previewUrl && inputRef.current?.click()}
                className={uploadZoneClass(!!previewUrl)}
              >
                {!previewUrl ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center select-none">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-colors",
                      dragging ? "bg-primary/10 border-primary/40" : "bg-muted/50 border-border"
                    )}>
                      <Mic className={cn("w-7 h-7 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">
                      {dragging ? "Drop to upload" : "Drop an audio file here or browse files"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP3, WAV, M4A, OGG · Max 100 MB
                    </p>
                  </div>
                ) : (
                  <div className="w-full p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{file?.name}</p>
                        {file && <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearMedia(); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/80 hover:bg-muted rounded-lg border border-border transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Audio preview</span>
                      </div>
                      <audio controls className="w-full" src={previewUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTR.audio}
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* ── VIDEO upload zone ── */}
            {tab === "video" && (
              <div
                {...(!previewUrl ? dropHandlers : {})}
                onClick={() => !previewUrl && inputRef.current?.click()}
                className={uploadZoneClass(!!previewUrl)}
              >
                {!previewUrl ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center select-none">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-colors",
                      dragging ? "bg-primary/10 border-primary/40" : "bg-muted/50 border-border"
                    )}>
                      <Video className={cn("w-7 h-7 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">
                      {dragging ? "Drop to upload" : "Drop a video here or browse files"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP4, WebM, MOV · Max 100 MB
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-0">
                    <video
                      controls
                      className="w-full max-h-[320px] object-contain bg-black"
                      src={previewUrl}
                    >
                      Your browser does not support the video element.
                    </video>
                    <div className="p-4 bg-gradient-to-t from-background/90 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs font-medium text-foreground truncate max-w-[200px]">{file?.name}</p>
                          {file && <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearMedia(); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/80 hover:bg-muted rounded-lg border border-border transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTR.video}
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* ── URL input zone ── */}
            {tab === "url" && (
              <div className="relative rounded-2xl border border-border bg-card p-6 min-h-[260px] flex items-center justify-center">
                {!activeDemoKey ? (
                  <div className="w-full max-w-md mx-auto text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl border bg-muted/50 border-border flex items-center justify-center mx-auto mb-4">
                      <Link2 className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-base font-semibold text-foreground">Analyze a URL</p>
                    <p className="text-sm text-muted-foreground mb-4">Paste a link to an article, image, or video.</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/media"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-grow h-11 px-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && urlInput.trim()) {
                            handleAnalyze();
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-md mx-auto text-center space-y-4">
                     <div className="flex items-center justify-center gap-3 bg-muted/30 p-4 rounded-xl border border-border">
                        <Link2 className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground truncate">Demo URL Selected</span>
                     </div>
                     <button
                        onClick={clearMedia}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                     >
                        Clear selection
                     </button>
                  </div>
                )}
              </div>
            )}

            {/* File error banner */}
            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3"
              >
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{fileError}</p>
                <button
                  onClick={() => setFileError(null)}
                  className="ml-auto text-destructive/60 hover:text-destructive transition-colors"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Active demo case indicator */}
            {activeDemoKey && (
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                <ScanSearch className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Demo case loaded: <span className="text-primary">{DEMO_CASES.find((d) => d.key === activeDemoKey)?.title}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Ready to analyze using demo data.</p>
                </div>
                <button
                  onClick={clearMedia}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  aria-label="Remove demo case"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Analyze button */}
            {hasMedia && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Button
                  onClick={handleAnalyze}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group shadow-[0_0_20px_rgba(var(--primary),0.25)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all"
                >
                  <ScanSearch className="w-5 h-5 mr-2" />
                  Analyze Media
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* Demo Cases */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Try a Demo Case</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_CASES.map((demo) => {
                  const DIcon = demo.icon;
                  const result = DEMO_RESULTS[demo.key];
                  const isActive = activeDemoKey === demo.key;
                  return (
                    <button
                      key={demo.key}
                      onClick={() => handleDemoCase(demo)}
                      className={cn(
                        "text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                        isActive
                          ? "border-primary/50 bg-primary/10"
                          : "border-border glass-panel hover:border-primary/30"
                      )}
                    >
                      <div className={cn("w-full h-20 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br overflow-hidden relative", demo.gradient)}>
                        <DIcon className={cn("w-8 h-8", demo.iconColor)} />
                        <div className="absolute top-2 left-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-background/40 px-1.5 py-0.5 rounded-full">
                            {demo.tab}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className={cn(
                            "text-xs font-bold font-mono px-2 py-0.5 rounded-full",
                            result.verdict === "authentic"  ? "bg-success/20 text-success" :
                            result.verdict === "manipulated" ? "bg-destructive/20 text-destructive" :
                            "bg-warning/20 text-warning"
                          )}>
                            {result.score}/100
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-1">{demo.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{demo.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex gap-2 items-start justify-center mt-6 p-4 bg-card border border-border rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl text-center">
                <strong>Privacy & Security:</strong> Media is handled securely. API keys are kept server-side. However, please avoid uploading highly sensitive or private material. Results are AI-assisted assessments and not definitive proof.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── SCANNING ── */}
        {phase === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanAnimation stages={currentStages} onComplete={handleScanComplete} />
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && activeResult && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnalysisResult
              result={activeResult}
              imageUrl={imageUrl}
              audioUrl={audioUrl}
              videoUrl={videoUrl}
              urlValue={activeUrlValue}
              onReset={clearMedia}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
