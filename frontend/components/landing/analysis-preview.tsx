import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export function AnalysisPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Don&apos;t just get a verdict. <br className="hidden md:block" /> Understand why.
          </h2>
          <p className="text-lg text-muted-foreground">
            TrueSight provides transparent explanations for its assessments, helping you understand the signals behind the score.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
              <div className="font-mono text-sm tracking-widest text-muted-foreground">AUTHENTICITY ASSESSMENT</div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
            </div>
            
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
              {/* Left Column - Score */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center md:border-r border-border md:pr-10">
                <div className="relative flex items-center justify-center w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" className="stroke-muted fill-none stroke-[8]" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      className="stroke-success fill-none stroke-[8]" 
                      strokeDasharray="440" 
                      strokeDashoffset={440 - (440 * 82) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-foreground">82</span>
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">/ 100</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Likely Authentic
                  </div>
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div className="flex-grow space-y-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Signals</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground/90">Visual consistency detected across subjects</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground/90">Natural lighting and realistic shadow rendering</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground/90">Metadata signatures appear intact and unmodified</span>
                    </li>
                    <li className="flex gap-3 text-sm mt-2 pt-2 border-t border-border/50">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                      <span className="text-foreground/90">Source origin could not be independently verified</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-5 rounded-xl border border-border">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary" />
                    Analysis Summary
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The image shows consistent lighting and texture patterns with no obvious signs of manipulation or AI generation artifacts. However, because the original source could not be independently verified, a perfect score cannot be assigned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
