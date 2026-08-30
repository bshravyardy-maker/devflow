"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project, ProjectStatus } from "@/types/dashboard";

const statusVariantMap: Record<
  ProjectStatus,
  "default" | "success" | "warning" | "purple" | "neutral" | "info"
> = {
  "In Progress": "info",
  Completed: "success",
  Planning: "purple",
  "On Hold": "warning",
};

export function ProjectCard({ project }: { project: Project }) {
  const isComplete = project.progress === 100 || project.status === "Completed";

  return (
    <Link href={`/projects/${project.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl">
      <Card className="flex flex-col justify-between p-5 transition-all duration-200 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer">
        <div className="space-y-3">
          {/* Card Header: Icon, Title, Status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-bold text-sm">
                {project.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {project.description}
                </p>
              </div>
            </div>

            <Badge
              variant={statusVariantMap[project.status]}
              className="text-[11px] font-medium shrink-0"
            >
              {project.status}
            </Badge>
          </div>

          {/* Progress bar & stats */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Progress
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {project.progress}%
              </span>
            </div>
            <Progress
              value={project.progress}
              className="h-1.5"
              indicatorColor={
                isComplete
                  ? "bg-emerald-600 dark:bg-emerald-500"
                  : project.status === "Planning"
                  ? "bg-purple-600 dark:bg-purple-500"
                  : "bg-indigo-600 dark:bg-indigo-500"
              }
            />
          </div>
        </div>

        {/* Footer Info: Tasks, Due Date, Tech Tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span>
                {project.completedTasks}/{project.totalTasks} tasks
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span>Due {project.dueDate}</span>
            </div>
          </div>

          {/* Technology tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
