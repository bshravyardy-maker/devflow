"use client";

import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";

interface DashboardHeaderProps {
  onNewTaskClick?: () => void;
}

export function DashboardHeader({ onNewTaskClick }: DashboardHeaderProps) {
  const { user } = useDashboard();

  // Dynamic greeting based on current local time
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Good morning, {user.name} 👋
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s what&apos;s happening with your development work.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>{dateFormatted}</span>
        </div>

        {onNewTaskClick && (
          <Button
            size="sm"
            onClick={onNewTaskClick}
            className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </Button>
        )}
      </div>
    </div>
  );
}
