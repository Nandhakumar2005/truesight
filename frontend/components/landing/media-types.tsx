import { Image, Mic, Video, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MediaTypes() {
  const mediaTypes = [
    {
      id: "image",
      title: "IMAGE",
      description: "Identify potential signs of visual inconsistencies and potential AI generation.",
      icon: Image,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "audio",
      title: "AUDIO",
      description: "Analyze potential synthetic or manipulated speech and audio patterns.",
      icon: Mic,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      id: "video",
      title: "VIDEO",
      description: "Analyze visual and audio signals together to identify deepfakes or manipulation.",
      icon: Video,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      id: "url",
      title: "URL",
      description: "Analyze supported media directly from a web link without downloading.",
      icon: Link2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/5 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            One place to verify almost anything.
          </h2>
          <p className="text-lg text-muted-foreground">
            TrueSight supports the most common media formats, giving you a unified toolkit for digital verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaTypes.map((type) => (
            <div 
              key={type.id} 
              className="glass-panel p-6 rounded-2xl transition-all duration-300 hover:bg-card hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 border", type.bg, type.color, type.border)}>
                <type.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wider">{type.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
