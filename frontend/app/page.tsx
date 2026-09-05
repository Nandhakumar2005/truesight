import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { TrustIndicators } from "@/components/landing/trust-indicators";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MediaTypes } from "@/components/landing/media-types";
import { AnalysisPreview } from "@/components/landing/analysis-preview";
import { PrivacySection } from "@/components/landing/privacy-section";
import { DemoCTA } from "@/components/landing/demo-cta";

export const metadata: Metadata = {
  title: "TrueSight — AI Media Verification",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <TrustIndicators />
        <HowItWorks />
        <MediaTypes />
        <AnalysisPreview />
        <PrivacySection />
        <DemoCTA />
      </main>

      <Footer />
    </div>
  );
}
