import React from "react";
import { FolderKanban, CheckSquare, TrendingUp, Clock, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const iconMap: Record<StatItem["icon"], LucideIcon> = {
  folder: FolderKanban,
  "check-square": CheckSquare,
  "trending-up": TrendingUp,
  clock: Clock,
};

const iconStyleMap: Record<
  StatItem["icon"],
  { bg: string; text: string; ring: string }
> = {
  folder: {
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-100 dark:ring-blue-900/40",
  },
  "check-square": {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-100 dark:ring-emerald-900/40",
  },
  "trending-up": {
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
    text: "text-indigo-600 dark:text-indigo-400",
    ring: "ring-indigo-100 dark:ring-indigo-900/40",
  },
  clock: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-100 dark:ring-amber-900/40",
  },
};

export function StatCard({ stat }: { stat: StatItem }) {
  const Icon = iconMap[stat.icon] || FolderKanban;
  const styles = iconStyleMap[stat.icon] || iconStyleMap.folder;

  return (
    <Card className="p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {stat.label}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 transition-transform group-hover:scale-105",
            styles.bg,
            styles.text,
            styles.ring
          )}
        >
          <Icon className="h-4 w-4 stroke-[2.2]" />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {stat.value}
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              stat.trend === "positive"
                ? "bg-emerald-500"
                : stat.trend === "negative"
                ? "bg-rose-500"
                : "bg-slate-400"
            )}
          />
          {stat.supportingText}
        </p>
      </div>
    </Card>
  );
}
