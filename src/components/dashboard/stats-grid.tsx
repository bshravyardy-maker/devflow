"use client";

import React from "react";
import { useDashboard } from "@/context/dashboard-context";
import { StatCard } from "./stat-card";
import { StatCardSkeleton } from "@/components/states/loading-skeleton";

export function StatsGrid() {
  const { stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
