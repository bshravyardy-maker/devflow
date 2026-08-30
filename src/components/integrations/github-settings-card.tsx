"use client";

import React, { useState } from "react";
import {
  Github,
  Loader2,
  CheckCircle2,
  GitCommit,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/dashboard-context";
import {
  GithubConnectDialog,
  GithubDisconnectDialog,
} from "./github-dialogs";

const languageColor: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  HTML: "bg-orange-500",
  CSS: "bg-violet-500",
};

export function GithubSettingsCard() {
  const {
    githubState,
    githubAccount,
    githubDataStatus,
    githubNotice,
    connectGithub,
  } = useDashboard();
  const [connectOpen, setConnectOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const isConnecting = githubState === "connecting";
  const isConnected = githubState === "connected" && !!githubAccount;
  const isLive = githubDataStatus === "live";

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Github className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          GitHub
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Connect your GitHub account to bring your development activity into
          DevFlow.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 pt-5">
        {isConnecting && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Connecting to GitHub…
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reading your public profile and repositories
              </p>
            </div>
          </div>
        )}

        {isConnected && githubAccount && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 bg-emerald-50/40 dark:bg-emerald-950/30">
              <div className="flex items-center gap-3 min-w-0">
                {githubAccount.avatarUrl ? (
                  <Avatar className="h-11 w-11 ring-2 ring-slate-200 dark:ring-slate-700">
                    <AvatarImage
                      src={githubAccount.avatarUrl}
                      alt={`${githubAccount.displayName} avatar`}
                    />
                    <AvatarFallback className="bg-slate-900 text-white text-xs">
                      {githubAccount.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {githubAccount.displayName}
                    </p>
                    <Badge variant="success" className="text-[10px]">
                      {isLive ? "Live · Public" : "Demo data"}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                    @{githubAccount.username}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {githubAccount.connectedLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {githubAccount.profileUrl && (
                  <a
                    href={githubAccount.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View profile
                  </a>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDisconnectOpen(true)}
                  className="text-xs border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Disconnect GitHub
                </Button>
              </div>
            </div>

            {githubAccount.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {githubAccount.bio}
              </p>
            )}

            {!isLive && githubNotice && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/40">
                <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{githubNotice}</span>
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={connectGithub}
                  className="text-xs border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 shrink-0"
                >
                  Retry live sync
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {githubAccount.repositories}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Public Repos
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {githubAccount.followers}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Followers
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {githubAccount.following}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Following
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
                <p
                  className="text-lg font-bold text-slate-900 dark:text-white"
                  title="Total stars across your public repositories"
                >
                  {githubAccount.publicContributions}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Stars
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              {githubAccount.primaryLanguages.length > 0 && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Primary languages:
                </span>
              )}
              {githubAccount.primaryLanguages.length > 0 ? (
                githubAccount.primaryLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${languageColor[lang] || "bg-slate-400"}`}
                      aria-hidden="true"
                    />
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Languages unavailable (offline demo data)
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <GitCommit className="h-3 w-3" />
                {isLive
                  ? "Live · GitHub public API"
                  : "Demo data · offline"}
              </span>
            </div>
          </div>
        )}

        {!isConnected && !isConnecting && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 text-white">
                <Github className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Not connected</span>
                  <Badge variant="neutral" className="text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[300px]">
                  Connect to show your repositories and activity in DevFlow.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setConnectOpen(true)}
              className="text-xs gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium self-start sm:self-auto"
            >
              <Github className="h-3.5 w-3.5" />
              Connect GitHub
            </Button>
          </div>
        )}

        {githubState === "error" && (
          <div className="mt-3 flex items-center justify-between p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40">
            <p className="text-xs text-red-700 dark:text-red-300">
              Connection failed. Please try again.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={connectGithub}
            >
              Retry
            </Button>
          </div>
        )}
      </CardContent>

      <GithubConnectDialog isOpen={connectOpen} onClose={() => setConnectOpen(false)} />
      <GithubDisconnectDialog isOpen={disconnectOpen} onClose={() => setDisconnectOpen(false)} />
    </Card>
  );
}
