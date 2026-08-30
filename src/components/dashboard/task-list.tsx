"use client";

import React from "react";
import { Task } from "@/types/dashboard";
import { TaskItem } from "./task-item";
import { TaskSkeleton } from "@/components/states/loading-skeleton";
import { NoTasksEmptyState } from "@/components/states/empty-state";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onToggleTask: (taskId: string) => void;
  onResetFilters?: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  onToggleTask,
  onResetFilters,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <NoTasksEmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="space-y-2.5" role="list" aria-label="Tasks list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
      ))}
    </div>
  );
}
