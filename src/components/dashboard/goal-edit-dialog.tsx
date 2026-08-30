"use client";

import React, { useState, useEffect } from "react";
import { X, Target, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context/dashboard-context";

interface GoalEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoalEditDialog({ isOpen, onClose }: GoalEditDialogProps) {
  const { goals, updateGoalTarget } = useDashboard();

  const tasksGoal = goals.find((g) => g.type === "tasks");
  const focusGoal = goals.find((g) => g.type === "focus");
  const projectsGoal = goals.find((g) => g.type === "projects");

  const [tasksTarget, setTasksTarget] = useState<number>(
    tasksGoal?.target || 30
  );
  const [focusTarget, setFocusTarget] = useState<number>(
    focusGoal?.target || 20
  );
  const [projectsTarget, setProjectsTarget] = useState<number>(
    projectsGoal?.target || 2
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasksGoal) updateGoalTarget(tasksGoal.id, Number(tasksTarget));
    if (focusGoal) updateGoalTarget(focusGoal.id, Number(focusTarget));
    if (projectsGoal) updateGoalTarget(projectsGoal.id, Number(projectsTarget));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-dialog-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Target className="h-4 w-4 stroke-[2.2]" />
            </div>
            <h2
              id="goal-dialog-title"
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              Edit Weekly Productivity Goals
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Weekly Tasks Target (Completed tasks)
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={tasksTarget}
              onChange={(e) => setTasksTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Weekly Focus Target (Hours)
            </label>
            <Input
              type="number"
              min="1"
              max="80"
              value={focusTarget}
              onChange={(e) => setFocusTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Weekly Projects Target (Completed / Shipped)
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={projectsTarget}
              onChange={(e) => setProjectsTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save Goals
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
