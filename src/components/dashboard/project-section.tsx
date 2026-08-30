"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "./project-card";
import { ProjectCardSkeleton } from "@/components/states/loading-skeleton";
import { NoProjectsEmptyState } from "@/components/states/empty-state";
import { useDashboard } from "@/context/dashboard-context";

export function ProjectSection() {
  const { filteredProjects, isLoading, searchQuery, setSearchQuery } =
    useDashboard();

  return (
    <section className="space-y-4" aria-labelledby="projects-heading">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            id="projects-heading"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Projects
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {filteredProjects.length}
          </span>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Dynamic Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <NoProjectsEmptyState onReset={() => setSearchQuery("")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProjects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
