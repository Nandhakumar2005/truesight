import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroMediaPreview } from "./hero-media-preview";
import { ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Next-Generation Media Verification</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Don&apos;t trust everything <br className="hidden lg:block" />
              you see. <br />
              <span className="text-gradient">Verify it with TrueSight.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              AI-generated media is becoming harder to recognize. TrueSight analyzes images, 
              audio, video and online media to help you understand what you&apos;re looking at 
              before you trust or share it.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
                  Analyze Media
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 border-border hover:bg-muted/50">
                  Try a Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-muted-foreground/80 font-medium">
              <span>Private by design</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>AI-assisted analysis</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Explainable results</span>
            </div>
          </div>

          {/* Visual Content */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            <HeroMediaPreview />
          </div>
          
        </div>
      </div>
    </section>
  );
}
