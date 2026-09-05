import { Image, Mic, Video, Link2 } from "lucide-react";

export function TrustIndicators() {
  const formats = [
    { name: "Images", icon: Image },
    { name: "Audio", icon: Mic },
    { name: "Video", icon: Video },
    { name: "URLs", icon: Link2 },
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-muted/10 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Verify before you share
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {formats.map((format) => (
              <div key={format.name} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm">
                  <format.icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="font-medium text-foreground">{format.name}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground pt-4">
            Built for everyday verification.
          </p>
        </div>
      </div>
    </section>
  );
}
