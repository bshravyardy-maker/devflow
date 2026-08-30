"use client";

import React, { useEffect } from "react";
import { X, Github, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/dashboard-context";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function useEscape(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

/**
 * "Connect GitHub" dialog. Simulates the OAuth authorization screen. Uses the
 * context githubState ("not_connected" | "connecting" | "connected" | "error")
 * to render the corresponding step. Backed by the mock github-service, so this
 * can later be swapped for a real OAuth popup/redirect.
 */
export function GithubConnectDialog({ isOpen, onClose }: DialogProps) {
  const { githubState, connectGithub, githubAccount } = useDashboard();
  useEscape(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-connect-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {githubState === "connecting" && (
          <div className="py-6 flex flex-col items-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Connecting…
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Reading your public profile and repositories
            </p>
          </div>
        )}

        {githubState === "connected" && githubAccount && (
          <div className="py-4 flex flex-col items-center text-center">
            {githubAccount.avatarUrl ? (
              <Avatar className="h-14 w-14 ring-4 ring-slate-100 dark:ring-slate-800">
                <AvatarImage
                  src={githubAccount.avatarUrl}
                  alt={`${githubAccount.displayName} avatar`}
                />
                <AvatarFallback className="bg-slate-900 text-white text-sm">
                  {githubAccount.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 ring-4 ring-slate-100 dark:ring-slate-800">
                <Github className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Connected
              </h2>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {githubAccount.displayName}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              @{githubAccount.username} · {githubAccount.followers} followers
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
              {githubAccount.connectedLabel}
            </p>
            <Button
              size="sm"
              className="mt-5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        )}

        {githubState === "error" && (
          <div className="py-6 flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Connection failed
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[280px]">
              We couldn&apos;t connect to GitHub. Please try again.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-4 text-xs border-slate-200 dark:border-slate-800"
              onClick={connectGithub}
            >
              Try again
            </Button>
          </div>
        )}

        {(githubState === "not_connected" || githubState === "disconnecting") && (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 ring-4 ring-slate-100 dark:ring-slate-800">
              <Github className="h-7 w-7 text-white" />
            </div>
            <h2
              id="github-connect-title"
              className="mt-4 text-base font-semibold text-slate-900 dark:text-white"
            >
              Connect your GitHub account
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-[300px]">
              Authorize DevFlow to access your public developer information and
              repository activity.
            </p>
            <Button
              type="button"
              size="sm"
              disabled={githubState === "disconnecting"}
              onClick={connectGithub}
              className="mt-5 w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {githubState === "disconnecting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              {githubState === "disconnecting"
                ? "Disconnecting…"
                : "Continue with GitHub"}
            </Button>
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              Reads only your public GitHub data via the public API — no
              credentials or OAuth are used.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Confirmation dialog shown before disconnecting GitHub.
 */
export function GithubDisconnectDialog({ isOpen, onClose }: DialogProps) {
  const { disconnectGithub } = useDashboard();
  useEscape(isOpen, onClose);

  if (!isOpen) return null;

  const handleDisconnect = () => {
    disconnectGithub();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-disconnect-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            <Github className="h-4 w-4" />
          </div>
          <div>
            <h2
              id="github-disconnect-title"
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              Disconnect GitHub?
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your GitHub data will no longer be displayed in DevFlow.
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDisconnect}
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
