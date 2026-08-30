"use client";

import React, { useState } from "react";
import { Target, CheckCircle2, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { ProductivityGoal } from "@/types/dashboard";
import { GoalEditDialog } from "./goal-edit-dialog";
import { cn } from "@/lib/utils";

interface GoalProgressProps {
  goal: ProductivityGoal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const percentage = Math.min(
    100,
    Math.round((goal.current / goal.target) * 100)
  );
  const isCompleted = goal.current >= goal.target;
  const remaining = Math.max(0, goal.target - goal.current);

  return (
    <div className="space-y-2 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {/* Top Label & Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {goal.title}
        </span>
        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <Badge variant="success" className="text-[10px] gap-1 py-0.5 px-2">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {remaining} {goal.unit} left
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        value={percentage}
        className="h-2"
        indicatorColor={
          isCompleted
            ? "bg-emerald-600 dark:bg-emerald-500"
            : percentage >= 50
            ? "bg-indigo-600 dark:bg-indigo-500"
            : "bg-amber-500 dark:bg-amber-400"
        }
      />

      {/* Bottom Numbers & Percentage */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">
            {goal.current}
          </strong>{" "}
          / {goal.target} {goal.unit}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export function ProductivityGoalsCard() {
  const { goals } = useDashboard();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const completedGoalsCount = goals.filter((g) => g.current >= g.target).length;

  return (
    <section className="space-y-4" aria-labelledby="goals-heading">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Target className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div>
            <h2
              id="goals-heading"
              className="text-base font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              Weekly Goals
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="text-[10px]">
            {completedGoalsCount} of {goals.length} Achieved
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white gap-1"
          >
            <Edit3 className="h-3 w-3" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {goals.map((goal) => (
            <GoalProgress key={goal.id} goal={goal} />
          ))}
        </div>
      </Card>

      <GoalEditDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </section>
  );
}
