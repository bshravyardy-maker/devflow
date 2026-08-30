"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FolderKanban,
  GitBranch,
  Users,
  Clock,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TaskItem } from "@/components/dashboard/task-item";
import { useDashboard } from "@/context/dashboard-context";
import { ProjectStatus, TaskFilter } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const statusVariantMap: Record<
  ProjectStatus,
  "default" | "success" | "warning" | "purple" | "neutral" | "info"
> = {
  "In Progress": "info",
  Completed: "success",
  Planning: "purple",
  "On Hold": "warning",
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { projects, tasks, activities, toggleTaskStatus } = useDashboard();

  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilterState, setTaskFilterState] = useState<TaskFilter>("all");

  const project = projects.find((p) => p.id === projectId);

  const projectTasks = useMemo(() => {
    if (!project) return [];
    return tasks.filter(
      (t) => t.projectId === project.id || t.projectName === project.name
    );
  }, [project, tasks]);

  const filteredProjectTasks = useMemo(() => {
    return projectTasks.filter((t) => {
      if (taskFilterState === "todo" && t.status !== "todo") return false;
      if (taskFilterState === "in_progress" && t.status !== "in_progress")
        return false;
      if (taskFilterState === "completed" && t.status !== "completed")
        return false;
      if (taskSearch.trim()) {
        const q = taskSearch.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [projectTasks, taskFilterState, taskSearch]);

  const projectActivities = useMemo(() => {
    if (!project) return [];
    return activities.filter(
      (a) =>
        a.projectId === project.id ||
        a.target === project.name
    ).slice(0, 6);
  }, [project, activities]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <FolderKanban className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Project Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          The project you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/projects")}
          className="text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const isComplete =
    project.progress === 100 || project.status === "Completed";

  const completedCount = projectTasks.filter(
    (t) => t.status === "completed"
  ).length;
  const todoCount = projectTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = projectTasks.filter(
    (t) => t.status === "in_progress"
  ).length;

  const filterTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projectTasks.length },
    { id: "todo", label: "To Do", count: todoCount },
    { id: "in_progress", label: "In Progress", count: inProgressCount },
    { id: "completed", label: "Done", count: completedCount },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/projects")}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white -ml-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Projects
        </Button>
      </div>

      {/* Project Header Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-bold text-base">
              {project.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {project.description}
              </p>
            </div>
          </div>
          <Badge
            variant={statusVariantMap[project.status]}
            className="text-xs font-semibold self-start"
          >
            {project.status}
          </Badge>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500 dark:text-slate-400">
              Overall Progress
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {project.progress}%
            </span>
          </div>
          <Progress
            value={project.progress}
            className="h-2"
            indicatorColor={
              isComplete
                ? "bg-emerald-600 dark:bg-emerald-500"
                : "bg-indigo-600 dark:bg-indigo-500"
            }
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>
              <strong className="font-semibold">{project.completedTasks}</strong>/{project.totalTasks} Tasks
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>Due {project.dueDate}</span>
          </div>
          {project.githubRepo && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <GitBranch className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{project.githubRepo}</span>
            </div>
          )}
          {project.lead && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>{project.lead}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>

      {/* Project Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Project Tasks ({projectTasks.length})
          </h2>
          <div className="relative w-full sm:w-56">
            <Input
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              placeholder="Search project tasks..."
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            {taskSearch && (
              <button
                onClick={() => setTaskSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs overflow-x-auto w-fit">
          {filterTabs.map((tab) => {
            const isActive = taskFilterState === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTaskFilterState(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px]",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task List */}
        {filteredProjectTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No tasks match your filter
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try adjusting the filter or search query.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredProjectTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTaskStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Activity */}
      {projectActivities.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {projectActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3.5 text-xs"
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5",
                    act.iconType === "check"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : act.iconType === "plus"
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : act.iconType === "zap"
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {act.iconType === "check" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                    {act.description}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 mt-0.5">
                    {act.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
