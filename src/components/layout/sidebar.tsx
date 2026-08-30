"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Terminal,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

export const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useDashboard();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-5 select-none transition-colors",
        className
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Top Brand / Logo */}
      <div className="space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 font-semibold text-slate-900 dark:text-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          onClick={onNavigate}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950 transition-transform group-hover:scale-105">
            <Terminal className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              DevFlow
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                PRO
              </span>
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
              Productivity Hub
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1" aria-label="Main Navigation">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isActive
                    ? "bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 stroke-[2.2]"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Profile */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar className="h-9 w-9 ring-1 ring-slate-200 dark:ring-slate-700">
                <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-medium text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                title="Online / In Flow"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {user.role}
              </p>
            </div>
          </div>
          <Link
            href="/settings"
            onClick={onNavigate}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Account Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            alert("Signed out from workspace (Demo mode)");
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
