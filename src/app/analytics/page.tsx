"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Flame,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDashboard } from "@/context/dashboard-context";
import { weeklyProductivityData, historicalCompletedTasks } from "@/data/mock-data";

export default function AnalyticsPage() {
  const { projects, tasks } = useDashboard();

  const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
  const totalTasksCount = tasks.length;
  const completionRate =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Max values for chart height calculations
  const maxFocus = Math.max(...weeklyProductivityData.map((d) => d.focusHours), 8);
  const maxTasks = Math.max(...weeklyProductivityData.map((d) => d.tasksCompleted), 8);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="h-4 w-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Productivity Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly performance telemetry, focus time distribution, and sprint velocity insights.
          </p>
        </div>

        <Badge
          variant="neutral"
          className="self-start sm:self-auto gap-1 text-xs py-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
        >
          <Calendar className="h-3 w-3 text-slate-400" />
          Sprint 34 (Current Week)
        </Badge>
      </div>

      {/* 1. Weekly Productivity Summary (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tasks Completed */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks Completed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.min(weeklyProductivityData.reduce((s, d) => s + d.tasksCompleted, 0), completedTasksCount + historicalCompletedTasks)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              +18% higher task velocity
            </p>
          </div>
        </Card>

        {/* Focus Hours */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Focus Hours
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              32.5 hrs
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              +4.2h logged this week
            </p>
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completion Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {completionRate}%
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
              +8% from last month
            </p>
          </div>
        </Card>

        {/* Productivity Streak */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Streak
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              5 Days <span className="text-base">🔥</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
              Daily goal met consistently
            </p>
          </div>
        </Card>
      </div>

      {/* 2. Visual Charts Section: Focus Time vs Tasks Completion */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Focus Time Chart */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                Daily Focus Hours
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Focus sessions tracked per day
              </p>
            </div>
            <Badge variant="neutral" className="text-[10px]">
              Peak: Thu (8.0h)
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex items-end justify-between h-48 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800 gap-2 sm:gap-4">
              {weeklyProductivityData.map((item) => {
                const heightPercent = Math.round((item.focusHours / maxFocus) * 100);
                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center gap-2 flex-1 h-full justify-end group"
                  >
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.focusHours}h
                    </span>
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-md relative flex items-end h-32 overflow-hidden">
                      <div
                        className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-all duration-500 group-hover:bg-indigo-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Avg Daily: 6.5h</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Total: 32.5 hrs logged
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Task Completion Chart */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                Daily Tasks Completed
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Shipped tickets across sprint days
              </p>
            </div>
            <Badge variant="success" className="text-[10px]">
              Target Met: 5/7 Days
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex items-end justify-between h-48 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800 gap-2 sm:gap-4">
              {weeklyProductivityData.map((item) => {
                const heightPercent = Math.round((item.tasksCompleted / maxTasks) * 100);
                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center gap-2 flex-1 h-full justify-end group"
                  >
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.tasksCompleted}
                    </span>
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-md relative flex items-end h-32 overflow-hidden">
                      <div
                        className="w-full bg-emerald-600 dark:bg-emerald-500 rounded-t-md transition-all duration-500 group-hover:bg-emerald-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Weekly Target: 30 tasks</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Completed: 27 tasks
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Project Velocity & Progress */}
      <Card className="p-5">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
            Active Project Progress & Health
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {p.name}
                    </span>
                    <span className="text-slate-400">
                      ({p.completedTasks}/{p.totalTasks} tasks)
                    </span>
                  </div>
                  <Badge
                    variant={
                      p.status === "Completed"
                        ? "success"
                        : p.status === "Planning"
                        ? "purple"
                        : "info"
                    }
                    className="text-[10px]"
                  >
                    {p.status}
                  </Badge>
                </div>
                <Progress
                  value={p.progress}
                  className="h-2"
                  indicatorColor={
                    p.progress === 100
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : p.progress > 50
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-purple-600 dark:bg-purple-500"
                  }
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Due {p.dueDate}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {p.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Deterministic Productivity Insights (Feature 3) */}
      <section className="space-y-3" aria-labelledby="insights-heading">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Lightbulb className="h-4 w-4 stroke-[2.2]" />
          </div>
          <h2
            id="insights-heading"
            className="text-base font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            Productivity Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-indigo-600 dark:border-l-indigo-500">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Peak Flow Day: Thursday
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  You logged your highest focus session count (8.0h) on Thursday morning during uninterrupted coding blocks.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600 dark:border-l-emerald-500">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  18% Higher Task Velocity
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  You completed 18% more tasks this week compared to Sprint 33, keeping your live milestone completion rate at {completionRate}%.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-600 dark:border-l-purple-500">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Focus Time Up +2.4 Hours
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Your Pomodoro sessions on &ldquo;Developer Dashboard&rdquo; and &ldquo;API Platform&rdquo; increased deep work consistency.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
