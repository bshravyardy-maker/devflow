"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Sun,
  Moon,
  Laptop,
  Target,
  Bell,
  Github,
  Keyboard,
  Mail,
  MapPin,
  Check,
  GitBranch,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/dashboard-context";
import { ThemeMode } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { GithubSettingsCard } from "@/components/integrations/github-settings-card";
import { GithubRepositories } from "@/components/integrations/github-repositories";

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["⌘ K"], label: "Open command palette" },
  { keys: ["N"], label: "Create a new task" },
  { keys: ["F"], label: "Start focus mode" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "T"], label: "Go to Tasks" },
  { keys: ["G", "P"], label: "Go to Projects" },
  { keys: ["G", "A"], label: "Go to Analytics" },
  { keys: ["G", "S"], label: "Go to Settings" },
];

export default function SettingsPage() {
  const {
    user,
    updateUserProfile,
    theme,
    setTheme,
    goals,
    updateGoalTarget,
    githubState,
    githubAccount,
  } = useDashboard();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const tasksGoal = goals.find((g) => g.type === "tasks");
  const focusGoal = goals.find((g) => g.type === "focus");
  const projectsGoal = goals.find((g) => g.type === "projects");

  const [tasksTarget, setTasksTarget] = useState<number>(
    tasksGoal?.target || 30
  );
  const [focusTarget, setFocusTarget] = useState<number>(
    focusGoal?.target || 20
  );
  const [projectsTarget, setProjectsTarget] = useState<number>(
    projectsGoal?.target || 2
  );

  const isGithubConnected = githubState === "connected" && !!githubAccount;

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasksGoal) updateGoalTarget(tasksGoal.id, Number(tasksTarget));
    if (focusGoal) updateGoalTarget(focusGoal.id, Number(focusTarget));
    if (projectsGoal) updateGoalTarget(projectsGoal.id, Number(projectsTarget));
  };

  const togglePreference = (key: "emailNotifications" | "weeklyDigest" | "showFocusTime") => {
    const next = !user.preferences[key];
    updateUserProfile({
      preferences: { ...user.preferences, [key]: next },
    });
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System (OS)", icon: Laptop },
  ];

  const preferenceRows: {
    key: "emailNotifications" | "weeklyDigest" | "showFocusTime";
    title: string;
    description: string;
  }[] = [
    {
      key: "emailNotifications",
      title: "Email notifications",
      description: "Receive project and task updates by email",
    },
    {
      key: "weeklyDigest",
      title: "Weekly digest",
      description: "A summary of your week every Friday",
    },
    {
      key: "showFocusTime",
      title: "Show focus time",
      description: "Display your focus hours on the dashboard",
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Settings className="h-4 w-4 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings & Preferences
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile, appearance, notifications, integrations, and shortcuts.
        </p>
      </div>

      {/* 1. Profile */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Profile
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Your personal details and workspace profile information.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-slate-200 dark:ring-slate-700">
                <AvatarFallback className="bg-indigo-600 text-white font-bold text-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.role} • Engineering
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="success" className="text-[10px]">
                    {user.statusText || "Online"}
                  </Badge>
                  <Badge variant="neutral" className="text-[10px]">
                    ID: dev_shravya_84
                  </Badge>
                </div>
                <p className="mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setEditProfileOpen(true)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shrink-0"
            >
              Edit Profile
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
              <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Email
                </p>
                <p className="truncate text-slate-800 dark:text-slate-200 font-medium">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
              <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Location
                </p>
                <p className="truncate text-slate-800 dark:text-slate-200 font-medium">
                  {user.location || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 p-3 sm:col-span-2">
              <Github className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  GitHub username
                </p>
                <p className="truncate text-slate-800 dark:text-slate-200 font-medium">
                  {user.githubUsername ? `@${user.githubUsername}` : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <EditProfileDialog
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
        />
      </Card>

      {/* 2. Appearance */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Appearance & Theme
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Customize the dashboard color mode or sync automatically with your operating system.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.mode;

              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setTheme(opt.mode)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all text-left",
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Notifications */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Notifications & Preferences
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Choose what you want to be notified about and how it appears.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-4 space-y-3">
          {preferenceRows.map((row) => {
            const value = user.preferences[row.key];
            return (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {row.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {row.description}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={value}
                  aria-label={row.title}
                  onClick={() => togglePreference(row.key)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    value ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                      value ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            );
          })}
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Preference changes are saved automatically.
          </p>
        </CardContent>
      </Card>

      {/* 4. Productivity Goals */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Productivity Goals Target
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Set and fine-tune your weekly targets for tasks, focus duration, and completed projects.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveGoals} className="p-0 pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Tasks Target
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={tasksTarget}
                onChange={(e) => setTasksTarget(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Current: {tasksGoal?.current || 27} tasks
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Focus Target (Hours)
              </label>
              <Input
                type="number"
                min="1"
                max="80"
                value={focusTarget}
                onChange={(e) => setFocusTarget(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Current: {focusGoal?.current || 15} hours
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Projects Target
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={projectsTarget}
                onChange={(e) => setProjectsTarget(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-9 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Current: {projectsGoal?.current || 2} projects
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4"
            >
              Update Targets
            </Button>
          </div>
        </form>
      </Card>

      {/* 5. Integrations */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Integrations
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Connect your development tools and services.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-5 space-y-4">
          <GithubSettingsCard />

          {isGithubConnected && (
            <div className="space-y-4">
              <GithubRepositories />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Keyboard Shortcuts */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Speed up your workflow with these shortcuts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5"
              >
                <span className="text-xs text-slate-700 dark:text-slate-200">
                  {s.label}
                </span>
                <span className="flex items-center gap-1">
                  {s.keys.map((k, idx) => (
                    <kbd
                      key={idx}
                      className="inline-flex min-w-[1.5rem] items-center justify-center rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
            Press G then a letter to navigate between sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
