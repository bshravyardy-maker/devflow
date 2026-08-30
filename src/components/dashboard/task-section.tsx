"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "./task-list";
import { useDashboard } from "@/context/dashboard-context";
import { TaskFilter } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const filterTabs: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export function TaskSection() {
  const {
    filteredTasks,
    taskFilter,
    setTaskFilter,
    toggleTaskStatus,
    isLoading,
    searchQuery,
    setSearchQuery,
    tasks,
  } = useDashboard();

  // Task counts for each filter tab badge
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const handleReset = () => {
    setTaskFilter("all");
    setSearchQuery("");
  };

  return (
    <section className="space-y-4" aria-labelledby="tasks-heading">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2
            id="tasks-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            My Tasks
          </h2>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            {filteredTasks.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tasks"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors rounded"
          >
            <span>Manage all tasks</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs">
          {filterTabs.map((tab) => {
            const isActive = taskFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTaskFilter(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
                aria-pressed={isActive}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px]",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active filter summary & clear button */}
        {(taskFilter !== "all" || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white gap-1 px-2"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Task List Content */}
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onToggleTask={toggleTaskStatus}
        onResetFilters={handleReset}
      />
    </section>
  );
}
