"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Github,
  Star,
  GitFork,
  Eye,
  GitBranch,
  Link2,
  Folder,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { GithubRepository } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const languageColor: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  HTML: "bg-orange-500",
  CSS: "bg-violet-500",
};

function LanguageDot({ language }: { language: string }) {
  if (!language) return null;
  const color = languageColor[language] || "bg-slate-400";
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden="true" />
      {language}
    </span>
  );
}

export function GithubRepositories() {
  const { githubRepositories, githubDataStatus } = useDashboard();
  const [selected, setSelected] = useState<GithubRepository | null>(null);

  const isLive = githubDataStatus === "live";

  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  return (
    <section className="space-y-4" aria-labelledby="github-repos-heading">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <h2
          id="github-repos-heading"
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
        >
          <Github className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          GitHub Repositories
        </h2>
        <Badge
          variant="neutral"
          className={cn("text-[10px]", !isLive && "text-amber-700 dark:text-amber-400")}
        >
          {isLive
            ? `${githubRepositories.length} public repos`
            : `${githubRepositories.length} demo repos`}
        </Badge>
      </div>

      {!isLive && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Showing offline demo data — public API unavailable.
        </p>
      )}

      {githubRepositories.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No public repositories
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This GitHub account has no public repositories to display.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {githubRepositories.map((repo) => (
            <Card
              key={repo.id}
              className="p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm flex flex-col min-w-0"
            >
              <button
                type="button"
                onClick={() => setSelected(repo)}
                className="w-full text-left"
                aria-label={`View repository ${repo.name}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <GitBranch className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {repo.name}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400 break-words">
                      {repo.description || "No description"}
                    </p>
                  </div>
                  <Badge
                    variant={repo.visibility === "public" ? "success" : "neutral"}
                    className="text-[10px] shrink-0"
                  >
                    {repo.visibility === "public" ? "Public" : "Private"}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <LanguageDot language={repo.primaryLanguage} />
                  <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <GitFork className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                    {repo.forks}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">
                    {repo.updatedAt}
                  </span>
                </div>
              </button>

              {repo.url ? (
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                  aria-label={`Open ${repo.name} on GitHub`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open on GitHub
                </a>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Link2 className="h-3.5 w-3.5" />
                  No link (offline demo data)
                </span>
              )}
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="repo-detail-title"
        >
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 text-white">
                  <Folder className="h-4 w-4" />
                </div>
                <h2
                  id="repo-detail-title"
                  className="text-base font-semibold text-slate-900 dark:text-white truncate"
                >
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 break-words">
              {selected.description || "No description provided."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3 min-w-0">
                {selected.primaryLanguage ? (
                  <LanguageDot language={selected.primaryLanguage} />
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    No language
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <Eye className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-slate-700 dark:text-slate-200">
                  {selected.visibility === "public" ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-slate-700 dark:text-slate-200">
                  {selected.stars} stars
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <GitFork className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-slate-700 dark:text-slate-200">
                  {selected.forks} forks
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {selected.updatedAt}
              </p>
              {selected.url ? (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open on GitHub
                </a>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5 border-slate-200 dark:border-slate-700"
                  onClick={() => setSelected(null)}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  No live link (demo)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}