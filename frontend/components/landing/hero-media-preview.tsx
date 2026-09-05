"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Fingerprint, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function HeroMediaPreview() {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {/* Decorative background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl rounded-3xl opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative glass-panel rounded-2xl overflow-hidden border border-white/10"
      >
        {/* Mock Image Area */}
        <div className="relative h-48 bg-muted/30 overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <ImageIcon className="w-16 h-16" />
          </div>
          
          {/* Faux image content */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent mix-blend-overlay" />
          
          {/* Scanning Line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_2px_rgba(var(--primary),0.8)] z-10"
            style={{ top: `${scanProgress}%` }}
          />
          
          {/* Scan highlight */}
          <motion.div
            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-primary/20 to-transparent z-0 pointer-events-none"
            style={{ top: `${scanProgress}%` }}
          />
        </div>

        {/* Analysis Results Box */}
        <div className="p-5 bg-card/80 backdrop-blur-sm relative z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-primary" />
              LIVE ANALYSIS
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
              PROCESSING
            </span>
          </div>
          
          <div className="space-y-3">
            <SignalIndicator label="AI Generation" value="LOW" status="success" />
            <SignalIndicator label="Manipulation" value="LOW" status="success" />
            <SignalIndicator label="Metadata" value="HIGH" status="warning" />
          </div>
          
          <div className="mt-5 pt-4 border-t border-border/50">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">AUTHENTICITY SCORE</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">82</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full border-4 border-success/20 border-t-success flex items-center justify-center">
                <span className="text-success font-bold text-sm">82%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Floating particles */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-1/4 w-2 h-2 rounded-full bg-primary blur-sm"
      />
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-6 bottom-1/3 w-3 h-3 rounded-full bg-secondary blur-sm"
      />
    </div>
  );
}

function SignalIndicator({ 
  label, 
  value, 
  status 
}: { 
  label: string; 
  value: string; 
  status: "success" | "warning" | "danger" 
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground/80">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-xs font-semibold font-mono",
          status === "success" && "text-success",
          status === "warning" && "text-warning",
          status === "danger" && "text-destructive"
        )}>
          {value}
        </span>
        {status === "success" && <CheckCircle2 className="w-4 h-4 text-success" />}
        {status === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
      </div>
    </div>
  );
}
