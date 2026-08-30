"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  User,
  FolderKanban,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context/dashboard-context";
import { Task, TaskPriority, TaskStatus } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function TaskDetailDialog() {
  const { selectedTask, setSelectedTask, updateTask, toggleTaskStatus } =
    useDashboard();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || "");
      setStatus(selectedTask.status);
      setPriority(selectedTask.priority);
      setDueDate(selectedTask.dueDate);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (!selectedTask) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTask(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedTask, setSelectedTask]);

  if (!selectedTask) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask({
      ...selectedTask,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
    });
    setSelectedTask(null);
  };

  const isCompleted = status === "completed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setSelectedTask(null)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedTask.projectName}
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Task ID: {selectedTask.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTask(null)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close task detail dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add detailed task notes, criteria, or pull request links..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
            />
          </div>

          {/* Status & Priority Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-slate-900 dark:text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-slate-900 dark:text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <Input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assignee
              </label>
              <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedTask.assignee || "Shravya"}</span>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toggleTaskStatus(selectedTask.id);
                setSelectedTask(null);
              }}
              className={cn(
                "text-xs gap-1.5",
                isCompleted
                  ? "text-slate-600 dark:text-slate-300"
                  : "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100"
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isCompleted ? "Reopen Task" : "Mark as Completed"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTask(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
