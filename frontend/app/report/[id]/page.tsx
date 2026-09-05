import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Fingerprint,
  ImageIcon,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/nav";
import { ReportActions } from "@/components/reports/report-actions";
import { cn } from "@/lib/utils";
import {
  getReportById,
  VERDICT_STYLES,
  SIGNAL_STYLES,
  type SignalLevel,
} from "@/lib/demo-data";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = getReportById(id);
  return {
    title: `Verification Report · ${report.filename}`,
    description: `TrueSight AI-assisted media authenticity assessment. Score: ${report.score}/100 — ${report.verdictLabel}.`,
  };
}

function signalIcon(level: SignalLevel) {
  if (level === "strong" || level === "low") return CheckCircle2;
  if (level === "moderate") return AlertTriangle;
  if (level === "high" || level === "weak") return XCircle;
  return HelpCircle;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = getReportById(id);
  const vs = VERDICT_STYLES[report.verdict];
  const verdictIconName = report.verdict;

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (report.score / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardNav />

      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
            Media Verification Report
          </h1>
          <p className="text-sm text-muted-foreground">AI-assisted media authenticity assessment</p>
        </div>

        {/* ── Metadata bar ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border">
            <Fingerprint className="w-3.5 h-3.5" />
            ID: <span className="font-mono font-medium text-foreground ml-1">{id}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border">
            <Calendar className="w-3.5 h-3.5" />
            {report.date}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border">
            <ImageIcon className="w-3.5 h-3.5" />
            {report.mediaType}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI-Assisted Assessment
          </div>
        </div>

        {/* ── Main assessment card ── */}
        <div className="glass-panel rounded-2xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Score ring */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" className="stroke-muted fill-none" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54"
                    className={cn("fill-none", vs.ring)}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-foreground">{report.score}</span>
                  <span className="text-sm text-muted-foreground font-medium">/100</span>
                </div>
              </div>

              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold",
                vs.bg, vs.color, vs.border
              )}>
                {verdictIconName === "authentic" && <CheckCircle2 className="w-4 h-4" />}
                {verdictIconName === "suspicious" && <AlertTriangle className="w-4 h-4" />}
                {verdictIconName === "manipulated" && <XCircle className="w-4 h-4" />}
                {report.verdictLabel}
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Confidence: <span className="font-semibold text-foreground">{report.confidence}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Analysis complete
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex-grow min-w-0 space-y-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                  Analyzed file
                </p>
                <p className="text-base font-semibold text-foreground truncate">{report.filename}</p>
              </div>

              {/* Assessment summary */}
              <div className="bg-muted/20 border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Assessment Summary
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.summary}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-2 bg-warning/5 border border-warning/15 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  TrueSight provides an AI-assisted assessment based on available media signals.
                  It does not provide a definitive determination of authenticity. Always apply
                  critical judgment before sharing or acting on media.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Signal breakdown ── */}
        <div className="glass-panel rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-base font-bold text-foreground mb-1">Signal Breakdown</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Individual signals assessed during the analysis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.signals.map((signal) => {
              const ss = SIGNAL_STYLES[signal.level];
              const SIcon = signalIcon(signal.level);
              return (
                <div key={signal.label} className="p-4 rounded-xl bg-muted/20 border border-border">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <SIcon className={cn("w-4 h-4 flex-shrink-0", ss.color)} />
                      <span className="text-sm font-semibold text-foreground">{signal.label}</span>
                    </div>
                    <span className={cn("text-xs font-bold whitespace-nowrap", ss.color)}>
                      {ss.label}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-muted rounded-full mb-2 overflow-hidden">
                    <div className={cn("h-full rounded-full", ss.barColor, ss.barWidth)} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {signal.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Actions (client component for clipboard) ── */}
        <ReportActions reportId={id} />

      </main>
    </div>
  );
}
