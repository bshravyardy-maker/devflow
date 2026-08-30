import React from "react";
import { SearchX, LucideIcon, FolderSearch, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title = "No results found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-8 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-3.5 shadow-sm">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="text-xs h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function NoTasksEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={CheckSquare}
      title="No tasks match this filter"
      description="You don't have any tasks matching the current status or search criteria."
      actionLabel={onReset ? "Reset filters" : undefined}
      onAction={onReset}
    />
  );
}

export function NoProjectsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={FolderSearch}
      title="No projects found"
      description="No projects match your current search keywords."
      actionLabel={onReset ? "Clear search" : undefined}
      onAction={onReset}
    />
  );
}
