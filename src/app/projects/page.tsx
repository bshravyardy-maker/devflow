"use client";

import React, { useState, useMemo } from "react";
import { FolderKanban, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/dashboard/project-card";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { ProjectCardSkeleton } from "@/components/states/loading-skeleton";
import { NoProjectsEmptyState } from "@/components/states/empty-state";
import { useDashboard } from "@/context/dashboard-context";
import { ProjectStatus } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type ProjectFilter = "all" | ProjectStatus;

export default function ProjectsPage() {
  const { projects, isLoading } = useDashboard();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ProjectFilter>("all");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const statusFilters: { id: ProjectFilter; label: string }[] = [
    { id: "all", label: "All Projects" },
    { id: "In Progress", label: "In Progress" },
    { id: "Completed", label: "Completed" },
    { id: "Planning", label: "Planning" },
  ];

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (selectedStatus !== "all" && p.status !== selectedStatus) {
        return false;
      }
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [projects, selectedStatus, localSearch]);

  const handleReset = () => {
    setSelectedStatus("all");
    setLocalSearch("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="h-4 w-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Projects
            </h1>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage engineering repositories, sprint targets, and roadmap delivery.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsNewProjectOpen(true)}
          className="h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs overflow-x-auto max-w-full">
          {statusFilters.map((tab) => {
            const isActive = selectedStatus === tab.id;
            const count =
              tab.id === "all"
                ? projects.length
                : projects.filter((p) => p.status === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search projects or tags..."
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

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <NoProjectsEmptyState onReset={handleReset} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* New Project Dialog */}
      <NewProjectDialog
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
    </div>
  );
}
