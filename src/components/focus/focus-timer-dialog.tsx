"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Coffee,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

interface FocusTimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FocusTimerDialog({ isOpen, onClose }: FocusTimerDialogProps) {
  const { tasks, completeFocusSession } = useDashboard();

  // Session configuration
  const [sessionType, setSessionType] = useState<"focus" | "short_break">(
    "focus"
  );
  const totalSeconds = sessionType === "focus" ? 25 * 60 : 5 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks[0]?.id || ""
  );
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  // Selected task
  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSessionCompleted = useCallback(() => {
    const duration = sessionType === "focus" ? 25 : 5;
    completeFocusSession({
      taskId: activeTask?.id,
      taskTitle: activeTask?.title || "Focus Sprint",
      projectName: activeTask?.projectName || "DevFlow",
      durationMinutes: duration,
      sessionType,
    });
    setShowSuccessBanner(true);
  }, [sessionType, completeFocusSession, activeTask]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionCompleted();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleSessionCompleted]);

  // When session type switches, reset timer
  const switchSessionType = (type: "focus" | "short_break") => {
    setSessionType(type);
    setIsRunning(false);
    setTimeLeft(type === "focus" ? 25 * 60 : 5 * 60);
    setShowSuccessBanner(false);
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
    setShowSuccessBanner(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === "focus" ? 25 * 60 : 5 * 60);
    setShowSuccessBanner(false);
  };

  const handleFinishEarly = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((totalSeconds - timeLeft) / 60)
    );
    completeFocusSession({
      taskId: activeTask?.id,
      taskTitle: activeTask?.title || "Focus Sprint",
      projectName: activeTask?.projectName || "DevFlow",
      durationMinutes: elapsedMinutes,
      sessionType,
    });
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setShowSuccessBanner(true);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // Percentage for circular progress
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h2
              id="focus-modal-title"
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              Focus Mode
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close focus timer dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mt-4 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => switchSessionType("focus")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
              sessionType === "focus"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Zap className="h-3.5 w-3.5" />
            25m Focus
          </button>

          <button
            type="button"
            onClick={() => switchSessionType("short_break")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
              sessionType === "short_break"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Coffee className="h-3.5 w-3.5" />
            5m Break
          </button>
        </div>

        {/* Success Alert Banner */}
        {showSuccessBanner && (
          <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Awesome job! Focus session logged and added to your weekly productivity stats.
            </span>
          </div>
        )}

        {/* Circular Countdown Progress */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center">
            <svg
              className="h-44 w-44 sm:h-48 sm:w-48 -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={cn(
                  "transition-all duration-500",
                  sessionType === "focus"
                    ? "stroke-indigo-600 dark:stroke-indigo-500"
                    : "stroke-emerald-600 dark:stroke-emerald-500"
                )}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Time & Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                {formattedTime}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                {sessionType === "focus"
                  ? isRunning
                    ? "Deep Focus"
                    : "Ready to Focus"
                  : "Break Time"}
              </span>
            </div>
          </div>
        </div>

        {/* Task Selection */}
        {sessionType === "focus" && (
          <div className="mb-5 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Working on task:
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isRunning}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/80 px-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-70"
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.projectName})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col-reverse gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs h-9 px-3 w-full border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 sm:w-auto"
            title="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>

          <div className="flex items-stretch gap-2 w-full sm:w-auto">
            {isRunning && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFinishEarly}
                className="text-xs h-9 flex-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white sm:flex-none"
              >
                Finish Early
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleStartPause}
              className={cn(
                "text-xs h-9 px-5 flex-1 font-semibold text-white shadow-sm sm:flex-none",
                isRunning
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {isRunning ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
