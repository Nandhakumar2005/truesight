import { Shield, Lock, History } from "lucide-react";

export function PrivacySection() {
  const features = [
    {
      title: "Secure Processing",
      description: "Media is processed securely with encrypted connections during analysis.",
      icon: Shield,
    },
    {
      title: "Controlled Access",
      description: "You control who sees your verification results with granular sharing options.",
      icon: Lock,
    },
    {
      title: "Private History",
      description: "Your past analyses are stored securely in your personal workspace.",
      icon: History,
    },
  ];

  return (
    <section id="security" className="py-24 border-y border-border/50 bg-card/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Your media is yours.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Media verification can involve sensitive or private content. 
              TrueSight is designed with privacy in mind, focusing on secure processing 
              and giving you control over your analysis history.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none relative">
            {/* Visual representation of privacy/security */}
            <div className="aspect-square md:aspect-video lg:aspect-square relative rounded-2xl overflow-hidden glass-panel border border-border p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              
              <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border flex items-center gap-4 shadow-sm" style={{ opacity: 1 - (i-1)*0.2 }}>
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted/50 rounded w-1/2" />
                      </div>
                      {i === 1 && (
                        <div className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-md border border-success/20">
                          Encrypted
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px]" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-[60px]" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
