"use client";

import React, { useState } from "react";
import { Search, Menu, X, Zap, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { FocusTimerDialog } from "@/components/focus/focus-timer-dialog";
import { useDashboard } from "@/context/dashboard-context";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    user,
    isFocusTimerOpen,
    setIsFocusTimerOpen,
  } = useDashboard();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left side: Mobile menu toggle + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks..."
            icon={<Search className="h-4 w-4" />}
            className="h-9 bg-slate-50/70 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-xs sm:text-sm pl-9 pr-8 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            aria-label="Search projects and tasks"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Focus Mode Button, Theme Toggle, Notifications, Status, and User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Focus Mode Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFocusTimerOpen(true)}
          className="h-9 gap-1.5 text-xs bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 font-medium px-2.5 sm:px-3"
          aria-label="Open Pomodoro Focus Mode"
        >
          <Zap className="h-3.5 w-3.5 fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Focus Mode</span>
        </Button>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {user.statusText || "In Flow"}
          </span>
        </div>

        {/* Theme Toggle (Feature 1) */}
        <ThemeToggle />

        {/* Notification Center (Feature 4) */}
        <NotificationCenter />

        {/* User Avatar + Name */}
        <button
          type="button"
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200/80 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 pr-1"
          aria-label="Open profile"
          title="Edit profile"
        >
          <Avatar className="h-8 w-8 ring-1 ring-slate-200 dark:ring-slate-700">
            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-medium text-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {user.role}
            </p>
          </div>
          <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Focus Timer Modal Dialog (Feature 2) */}
      <FocusTimerDialog
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileDialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </header>
  );
}
