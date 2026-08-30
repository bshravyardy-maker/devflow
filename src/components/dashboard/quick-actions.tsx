"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderPlus, Zap, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const router = useRouter();
  const { setIsNewTaskOpen, setIsNewProjectOpen, setIsFocusTimerOpen } =
    useDashboard();

  const actions = [
    {
      id: "quick-new-task",
      title: "New Task",
      subtitle: "Add to sprint backlog",
      icon: Plus,
      shortcut: "N",
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-700",
      action: () => setIsNewTaskOpen(true),
    },
    {
      id: "quick-new-proj",
      title: "New Project",
      subtitle: "Init repository roadmap",
      icon: FolderPlus,
      shortcut: "G P",
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-300 dark:hover:border-blue-700",
      action: () => setIsNewProjectOpen(true),
    },
    {
      id: "quick-focus",
      title: "Start Focus",
      subtitle: "25m deep work sprint",
      icon: Zap,
      shortcut: "F",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-700",
      action: () => setIsFocusTimerOpen(true),
    },
    {
      id: "quick-analytics",
      title: "View Analytics",
      subtitle: "Velocity & focus charts",
      icon: BarChart3,
      shortcut: "G A",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-700",
      action: () => router.push("/analytics"),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            type="button"
            onClick={act.action}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-left shadow-sm transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              act.border
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-105",
                  act.bg,
                  act.text
                )}
              >
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                {act.shortcut}
              </kbd>
            </div>

            <div className="mt-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {act.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {act.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
