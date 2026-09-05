import type { Metadata } from "next";
import Link from "next/link";
import {
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard/nav";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardNav />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome hero */}
        <section className="mb-10 relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10">
          {/* Background glow */}
          <div className="absolute top-[-30%] right-[-10%] w-[40%] h-[150%] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Good morning,</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                Verify suspicious media <br className="hidden md:block" /> before you share it.
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg">
                Upload an image, audio clip, video, or provide a URL and TrueSight will analyze it for signs of AI generation or manipulation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 flex-shrink-0">
              <Link href="/analyze">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 group w-full sm:w-auto">
                  <ScanSearch className="w-4 h-4 mr-2" />
                  Analyze New Media
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/report/demo-001">
                <Button variant="outline" className="h-11 px-6 border-border hover:bg-muted/50 w-full sm:w-auto">
                  Try Demo Cases
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Analyses Completed"
              value={127}
              icon={Activity}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              trend="All time"
            />
            <StatCard
              label="Likely Authentic"
              value={84}
              icon={CheckCircle2}
              iconColor="text-success"
              iconBg="bg-success/10"
              trend="66%"
            />
            <StatCard
              label="Suspicious"
              value={31}
              icon={AlertTriangle}
              iconColor="text-warning"
              iconBg="bg-warning/10"
              trend="24%"
            />
            <StatCard
              label="Reports Generated"
              value={12}
              icon={FileText}
              iconColor="text-secondary"
              iconBg="bg-secondary/10"
              trend="This month"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-10">
          <QuickActions />
        </section>

        {/* Recent analyses */}
        <section>
          <RecentAnalyses />
        </section>
      </main>
    </div>
  );
}
