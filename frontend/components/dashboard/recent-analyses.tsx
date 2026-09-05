import Link from "next/link";
import { Image, Mic, Video, Link2, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaKind = "image" | "audio" | "video" | "url";
type Verdict = "authentic" | "suspicious" | "manipulated" | "inconclusive";

interface Analysis {
  id: string;
  filename: string;
  kind: MediaKind;
  verdict: Verdict;
  score: number;
  date: string;
}

const MEDIA_ICONS: Record<MediaKind, React.ElementType> = {
  image: Image,
  audio: Mic,
  video: Video,
  url: Link2,
};

const MEDIA_COLORS: Record<MediaKind, string> = {
  image: "text-blue-400 bg-blue-500/10",
  audio: "text-purple-400 bg-purple-500/10",
  video: "text-emerald-400 bg-emerald-500/10",
  url: "text-amber-400 bg-amber-500/10",
};

function VerdictBadge({ verdict }: { verdict: Verdict; score: number }) {
  const config: Record<Verdict, { label: string; icon: React.ElementType; classes: string }> = {
    authentic: {
      label: "Likely Authentic",
      icon: CheckCircle2,
      classes: "bg-success/10 text-success border-success/20",
    },
    suspicious: {
      label: "Suspicious",
      icon: AlertTriangle,
      classes: "bg-warning/10 text-warning border-warning/20",
    },
    manipulated: {
      label: "Likely Manipulated",
      icon: AlertTriangle,
      classes: "bg-destructive/10 text-destructive border-destructive/20",
    },
    inconclusive: {
      label: "Inconclusive",
      icon: HelpCircle,
      classes: "bg-muted/50 text-muted-foreground border-border",
    },
  };

  const { label, icon: Icon, classes } = config[verdict];

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", classes)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function ScorePill({ score, verdict }: { score: number; verdict: Verdict }) {
  const color =
    verdict === "authentic"
      ? "text-success"
      : verdict === "suspicious"
      ? "text-warning"
      : verdict === "manipulated"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <span className={cn("font-bold font-mono text-sm tabular-nums", color)}>
      {score}
      <span className="text-muted-foreground font-normal">/100</span>
    </span>
  );
}

const DEMO_ANALYSES: Analysis[] = [
  { id: "demo-001", filename: "vacation-photo.jpg",   kind: "image", verdict: "authentic",   score: 92, date: "Sep 5, 2026" },
  { id: "demo-002", filename: "portrait-ai.png",       kind: "image", verdict: "manipulated", score: 28, date: "Sep 4, 2026" },
  { id: "demo-003", filename: "news-image.jpg",        kind: "image", verdict: "suspicious",  score: 41, date: "Sep 4, 2026" },
  { id: "demo-001", filename: "interview-frame.jpg",   kind: "image", verdict: "authentic",   score: 92, date: "Sep 3, 2026" },
  { id: "demo-001", filename: "press-release-clip.mp3",kind: "audio", verdict: "authentic",   score: 78, date: "Sep 2, 2026" },
];

export function RecentAnalyses() {
  return (
    <div className="glass-panel rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent Analyses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your latest verification results</p>
        </div>
        <Link href="/report/demo-001">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs font-medium">
            View all →
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">File</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verdict</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_ANALYSES.map((item) => {
              const MediaIcon = MEDIA_ICONS[item.kind];
              return (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", MEDIA_COLORS[item.kind])}>
                        <MediaIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate max-w-[180px]">{item.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <VerdictBadge verdict={item.verdict} score={item.score} />
                  </td>
                  <td className="px-4 py-4">
                    <ScorePill score={item.score} verdict={item.verdict} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/report/${item.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                      >
                        View Report
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
