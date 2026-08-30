"use client";

import React from "react";
import { Calendar, MoreHorizontal, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Task, TaskPriority } from "@/types/dashboard";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

const priorityConfig: Record<
  TaskPriority,
  { label: string; badgeVariant: "destructive" | "warning" | "neutral" }
> = {
  high: { label: "High", badgeVariant: "destructive" },
  medium: { label: "Medium", badgeVariant: "warning" },
  low: { label: "Low", badgeVariant: "neutral" },
};

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const { setSelectedTask } = useDashboard();
  const isCompleted = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-150",
        isCompleted
          ? "border-slate-200/50 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30 text-slate-500 dark:text-slate-500"
          : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
      )}
    >
      {/* Checkbox and task information */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Checkbox
          id={`task-${task.id}`}
          checked={isCompleted}
          onCheckedChange={() => onToggle(task.id)}
          aria-label={`Mark task ${task.title} as ${
            isCompleted ? "incomplete" : "complete"
          }`}
          className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-600 transition-colors"
        />

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => setSelectedTask(task)}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs sm:text-sm font-medium block truncate transition-colors",
                isCompleted
                  ? "line-through text-slate-400 dark:text-slate-500 font-normal"
                  : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}
            >
              {task.title}
            </span>
            {task.description && (
              <FileText className="h-3 w-3 text-slate-400 opacity-60 shrink-0 hidden sm:inline" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">
              {task.projectName}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>

      {/* Priority, Status Badges & Quick View trigger */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={priority.badgeVariant}
          className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5"
        >
          {priority.label}
        </Badge>

        <span
          className={cn(
            "hidden sm:inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            task.status === "completed"
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40"
              : task.status === "in_progress"
              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
          )}
        >
          {task.status === "in_progress"
            ? "In Progress"
            : task.status === "completed"
            ? "Done"
            : "To Do"}
        </span>

        <button
          type="button"
          onClick={() => setSelectedTask(task)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
          title="View & edit task details"
          aria-label="View task details"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
