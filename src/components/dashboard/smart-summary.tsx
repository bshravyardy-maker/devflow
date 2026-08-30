"use client";

import React from "react";
import {
  Calendar,
  Flame,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/context/dashboard-context";

export function SmartSummary() {
  const { user, tasks, projects, stats } = useDashboard();

  // Dynamic calculations
  const dueThisWeekCount = tasks.filter(
    (t) => t.dueDate === "Today" || t.dueDate === "Tomorrow" || t.dueDate.includes("Sep")
  ).length;

  const totalProjectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
        )
      : 0;

  const todayCompletedCount = tasks.filter((t) => t.status === "completed").length;

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-3 pb-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            You have{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">
              {dueThisWeekCount} tasks
            </strong>{" "}
            due this week and you&apos;re{" "}
            <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {totalProjectProgress}%
            </strong>{" "}
            through your active sprint deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Chips: Streak, Today's Focus, Tasks Completed Today */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-sm">
          <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
          <span>{user.streakDays} Days Streak</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:text-indigo-300 shadow-sm">
          <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{user.todayFocusHours}h Today&apos;s Focus</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{todayCompletedCount} Tasks Completed</span>
        </div>
      </div>
    </div>
  );
}
