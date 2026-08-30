"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ProductivityGoalsCard } from "@/components/dashboard/productivity-goals";
import { ProjectSection } from "@/components/dashboard/project-section";
import { TaskSection } from "@/components/dashboard/task-section";
import { ActivityList } from "@/components/dashboard/activity-list";
import { NewTaskDialog } from "@/components/dashboard/new-task-dialog";
import { ErrorState } from "@/components/states/error-state";
import { useDashboard } from "@/context/dashboard-context";

export default function DashboardPage() {
  const { isError, errorMessage, retryFetch, isNewTaskOpen, setIsNewTaskOpen } =
    useDashboard();

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting Header */}
      <DashboardHeader onNewTaskClick={() => setIsNewTaskOpen(true)} />

      {/* Main Dynamic Workspace Area */}
      {isError ? (
        <ErrorState
          title="Could not load workspace"
          description={
            errorMessage ||
            "We encountered an unexpected issue while loading your project workspace and task telemetry."
          }
          onRetry={retryFetch}
          className="my-8"
        />
      ) : (
        <div className="space-y-8">
          {/* 1. Overview Statistics (4 Cards) */}
          <StatsGrid />

          {/* 2. Personal Productivity Goals (Feature 5) */}
          <ProductivityGoalsCard />

          {/* 3. Projects Section (View all, 4 Cards) */}
          <ProjectSection />

          {/* 4. Tasks (2 cols) & Recent Activity (1 col) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TaskSection />
            </div>
            <div className="lg:col-span-1">
              <ActivityList />
            </div>
          </div>
        </div>
      )}

      {/* Interactive New Task Modal */}
      <NewTaskDialog
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />
    </div>
  );
}
