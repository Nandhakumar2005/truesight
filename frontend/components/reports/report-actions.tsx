"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  RotateCcw,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ReportActions({ reportId }: { reportId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/report/${reportId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <>
      {/* Toast */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
          copied
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
          <Check className="w-4 h-4 text-success" />
          Report link copied to clipboard
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/analyze" className="flex-1">
          <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze Another
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full h-11 border-border hover:bg-muted/50">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleShare}
          className={cn(
            "h-11 border-border hover:bg-muted/50 transition-all",
            copied && "border-success/40 bg-success/5 text-success"
          )}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {copied ? "Copied!" : "Share Report"}
        </Button>
      </div>
    </>
  );
}
