import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "amber" | "rose" | "sky" | "neutral";
  className?: string;
}

const tones = {
  brand: "bg-brand-100 text-brand-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
  sky: "bg-sky-100 text-sky-800",
  neutral: "bg-sand-100 text-ink-muted",
};

const StatCard = ({ label, value, hint, icon: Icon, tone = "brand", className }: StatCardProps) => {
  return (
    <div className={cn("surface flex items-start gap-4 p-5", className)}>
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          tones[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-medium leading-none text-ink">
          {value}
        </p>
        {hint && <p className="mt-1.5 truncate text-xs text-ink-soft">{hint}</p>}
      </div>
    </div>
  );
};

export default StatCard;
