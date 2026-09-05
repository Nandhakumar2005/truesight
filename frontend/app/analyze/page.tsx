import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/nav";
import { AnalyzerClient } from "@/components/analyzer/analyzer-client";

export const metadata: Metadata = {
  title: "Analyze Media",
  description: "Upload suspicious media and get an AI-assisted authenticity assessment in seconds.",
};

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardNav />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Verify media before you trust it.
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            Upload suspicious media and get an AI-assisted authenticity assessment in seconds.
          </p>
        </div>

        <AnalyzerClient />
      </main>
    </div>
  );
}
