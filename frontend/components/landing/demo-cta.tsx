import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function DemoCTA() {
  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 blur-[100px] rounded-full -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel max-w-5xl mx-auto rounded-3xl p-8 md:p-16 text-center border border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8 border border-primary/20 text-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            See what TrueSight can uncover.
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Try a sample investigation and see how an AI-assisted verification result is generated, 
            or sign up to analyze your own media.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyze" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 group">
                Try a Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 border-border bg-background/50 hover:bg-background">
                Analyze Your Media
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
