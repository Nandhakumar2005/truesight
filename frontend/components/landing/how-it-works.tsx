import { UploadCloud, Cpu, FileCheck2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "UPLOAD",
      description: "Upload an image, audio clip or video, or provide a media URL.",
      icon: UploadCloud,
    },
    {
      id: "02",
      title: "ANALYZE",
      description: "TrueSight combines AI analysis with available media signals.",
      icon: Cpu,
    },
    {
      id: "03",
      title: "UNDERSTAND",
      description: "Get a clear authenticity assessment and an explanation you can understand.",
      icon: FileCheck2,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            From media to insight in seconds.
          </h2>
          <p className="text-lg text-muted-foreground">
            A streamlined process designed to give you clarity when you need it most.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="relative group">
                <div className="glass-panel p-8 rounded-2xl h-full transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_-15px_rgba(var(--primary),0.3)] group-hover:border-primary/30">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center font-mono font-bold text-muted-foreground shadow-sm group-hover:text-primary transition-colors">
                    {step.id}
                  </div>
                  
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 tracking-wide">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
