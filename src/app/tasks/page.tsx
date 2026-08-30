"use client";

import React, { useState, useMemo } from "react";
import { CheckSquare, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskList } from "@/components/dashboard/task-list";
import { NewTaskDialog } from "@/components/dashboard/new-task-dialog";
import { useDashboard } from "@/context/dashboard-context";
import { TaskFilter, TaskPriority } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const filterTabs: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "All Tasks" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    toggleTaskStatus,
    isNewTaskOpen,
    setIsNewTaskOpen,
  } = useDashboard();
  const [localSearch, setLocalSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>(
    "all"
  );

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Status filter
      if (activeFilter === "todo" && t.status !== "todo") return false;
      if (activeFilter === "in_progress" && t.status !== "in_progress") return false;
      if (activeFilter === "completed" && t.status !== "completed") return false;

      // Priority filter
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

      // Search filter
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesProject = t.projectName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProject) return false;
      }

      return true;
    });
  }, [tasks, activeFilter, priorityFilter, localSearch]);

  const handleReset = () => {
    setActiveFilter("all");
    setPriorityFilter("all");
    setLocalSearch("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="h-4 w-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tasks
            </h1>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {filteredTasks.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, prioritize, and complete engineering tasks across your codebase.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsNewTaskOpen(true)}
          className="h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Controls Bar: Filter tabs + Priority selector + Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs overflow-x-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
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

        {/* Priority & Search controls */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as "all" | TaskPriority)
            }
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-xs text-slate-700 dark:text-slate-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <div className="relative flex-1">
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search tasks..."
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onToggleTask={toggleTaskStatus}
        onResetFilters={handleReset}
      />

      {/* New Task Dialog */}
      <NewTaskDialog
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />
    </div>
  );
}
