import Link from "next/link";
import { ScanSearch, Layers, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  accent?: boolean;
}

function QuickActionCard({ title, description, href, icon: Icon, iconColor, iconBg, accent }: QuickActionProps) {
  return (
    <Link href={href} className="group block">
      <div
        className={cn(
          "rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full",
          accent
            ? "bg-primary/10 border-primary/30 hover:bg-primary/15 hover:border-primary/50 hover:shadow-[0_8px_30px_-8px_rgba(var(--primary),0.3)]"
            : "glass-panel border-border hover:border-primary/20 hover:shadow-lg"
        )}
      >
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-300 group-hover:scale-110", iconBg, iconColor.replace("text-", "border-") + "/20")}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <div className={cn("flex items-center text-sm font-medium transition-colors gap-1", accent ? "text-primary" : "text-muted-foreground group-hover:text-primary")}>
          Get started
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function QuickActions() {
  const actions: QuickActionProps[] = [
    {
      title: "Analyze Media",
      description: "Upload and assess suspicious images, audio, or video.",
      href: "/analyze",
      icon: ScanSearch,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      accent: true,
    },
    {
      title: "Demo Cases",
      description: "Explore curated examples of AI-generated and manipulated media.",
      href: "/report/demo-001",
      icon: Layers,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/10",
    },
    {
      title: "Reports",
      description: "Review your generated verification reports.",
      href: "/report/demo-001",
      icon: FileText,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}
