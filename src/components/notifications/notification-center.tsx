"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Sparkles,
  Zap,
  Trash2,
  LucideIcon,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { NotificationItem, NotificationType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const notifIconMap: Record<
  NotificationType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  task_due: {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
  },
  task_completed: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
  },
  project_completed: {
    icon: FolderGit2,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
  },
  project_updated: {
    icon: FolderGit2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60",
  },
  milestone: {
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
  },
  focus_completed: {
    icon: Zap,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
  },
};

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4 stroke-[2]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px] ring-2 ring-white dark:ring-slate-900 shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-96 max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium px-1.5 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                  title="Mark all as read"
                >
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-xs text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clear all"
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="py-2 space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-60 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[11px] mt-0.5 text-slate-400 dark:text-slate-500">
                  No unread developer alerts or updates.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config =
                  notifIconMap[notif.type] || notifIconMap.task_completed;
                const Icon = config.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={cn(
                      "flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer group",
                      notif.read
                        ? "border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                        : "border-indigo-100/70 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-200"
                    )}
                  >
                    {/* Icon Bubble */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/5 dark:ring-white/10 mt-0.5",
                        config.bg,
                        config.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold truncate leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span
                        className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5"
                        title="Unread"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span>{notifications.length} total alerts</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
