import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor = "text-primary", iconBg = "bg-primary/10", trend }: StatCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-border hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", iconBg, iconColor.replace("text-", "border-").replace(/\b(\w+)\b/, "$1/20"))}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}
