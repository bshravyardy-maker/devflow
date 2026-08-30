"use client";

import React from "react";
import {
  CheckCircle2,
  FolderGit2,
  PlusCircle,
  Clock,
  GitCommit,
  Edit3,
  Zap,
  Target,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Activity } from "@/types/dashboard";
import { ActivitySkeleton } from "@/components/states/loading-skeleton";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

const iconMap: Record<Activity["iconType"], { icon: LucideIcon; color: string; bg: string }> = {
  check: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
  },
  plus: {
    icon: PlusCircle,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
  },
  edit: {
    icon: Edit3,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60",
  },
  folder: {
    icon: FolderGit2,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
  },
  git: {
    icon: GitCommit,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
  },
  zap: {
    icon: Zap,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
  },
  target: {
    icon: Target,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/60",
  },
};

export function ActivityList() {
  const { activities, isLoading } = useDashboard();

  return (
    <section className="space-y-4" aria-labelledby="activity-heading">
      <div className="flex items-center justify-between">
        <h2
          id="activity-heading"
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          Recent Activity
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Real-time</span>
      </div>

      <Card className="p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivitySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="relative pl-1">
            {/* Timeline line */}
            <div
              className="absolute left-[18px] top-3 bottom-3 w-px bg-slate-200/80 dark:bg-slate-800"
              aria-hidden="true"
            />

            <div className="space-y-4">
              {activities.slice(0, 6).map((activity) => {
                const config =
                  iconMap[activity.iconType] || iconMap.check;
                const Icon = config.icon;

                return (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-3.5 group"
                  >
                    {/* Activity Icon Bubble */}
                    <div
                      className={cn(
                        "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm",
                        config.bg,
                        config.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                    </div>

                    {/* Activity Details */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {activity.description}
                        {activity.source === "github" && (
                          <span className="ml-2 inline-flex items-center gap-1 align-middle rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            GitHub
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.timestamp}</span>
                        {activity.target && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              {activity.target}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
