"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  Zap,
  Moon,
  Sun,
  Plus,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "Projects" | "Tasks";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsNewTaskOpen,
    setIsFocusTimerOpen,
    theme,
    setTheme,
    projects,
    tasks,
    setSelectedTask,
  } = useDashboard();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const allCommands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Navigation
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Go to Dashboard",
        subtitle: "Overview metrics & active work",
        icon: LayoutDashboard,
        shortcut: "G D",
        action: () => router.push("/"),
      },
      {
        id: "nav-projects",
        category: "Navigation",
        title: "Go to Projects",
        subtitle: "Project directory and roadmaps",
        icon: FolderKanban,
        shortcut: "G P",
        action: () => router.push("/projects"),
      },
      {
        id: "nav-tasks",
        category: "Navigation",
        title: "Go to Tasks",
        subtitle: "Sprint backlog & task board",
        icon: CheckSquare,
        shortcut: "G T",
        action: () => router.push("/tasks"),
      },
      {
        id: "nav-analytics",
        category: "Navigation",
        title: "Go to Analytics",
        subtitle: "Velocity and focus hours",
        icon: BarChart3,
        shortcut: "G A",
        action: () => router.push("/analytics"),
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "Go to Settings",
        subtitle: "Appearance, goals & tokens",
        icon: Settings,
        shortcut: "G S",
        action: () => router.push("/settings"),
      },

      // Actions
      {
        id: "act-new-task",
        category: "Actions",
        title: "Create New Task",
        subtitle: "Add a new task to sprint",
        icon: Plus,
        shortcut: "N",
        action: () => setIsNewTaskOpen(true),
      },
      {
        id: "act-focus-mode",
        category: "Actions",
        title: "Start Focus Session",
        subtitle: "Launch Pomodoro 25m focus sprint",
        icon: Zap,
        shortcut: "F",
        action: () => setIsFocusTimerOpen(true),
      },
      {
        id: "act-toggle-theme",
        category: "Actions",
        title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
        subtitle: "Toggle color theme",
        icon: theme === "dark" ? Sun : Moon,
        action: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ];

    // Dynamic Projects Search
    projects.forEach((p) => {
      list.push({
        id: `proj-${p.id}`,
        category: "Projects",
        title: p.name,
        subtitle: `${p.progress}% completed • ${p.status}`,
        icon: FolderKanban,
        action: () => router.push(`/projects/${p.id}`),
      });
    });

    // Dynamic Tasks Search
    tasks.forEach((t) => {
      list.push({
        id: `task-${t.id}`,
        category: "Tasks",
        title: t.title,
        subtitle: `${t.projectName} • ${t.priority.toUpperCase()} priority`,
        icon: CheckSquare,
        action: () => {
          setSelectedTask(t);
        },
      });
    });

    return list;
  }, [
    router,
    setIsNewTaskOpen,
    setIsFocusTimerOpen,
    theme,
    setTheme,
    projects,
    tasks,
    setSelectedTask,
  ]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Group filtered items by category
  const grouped = useMemo(() => {
    const map: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [filteredCommands]);

  const flatItems = useMemo(() => {
    return filteredCommands;
  }, [filteredCommands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? flatItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[selectedIndex];
      if (item) {
        setIsCommandPaletteOpen(false);
        item.action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Modal */}
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden text-slate-900 dark:text-slate-100"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search workspace..."
            className="w-full h-14 bg-transparent px-3 text-sm focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
            aria-label="Command palette input"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-96 overflow-y-auto p-2 space-y-3"
          role="listbox"
        >
          {flatItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No matching commands or resources found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                  {category}
                </div>
                {items.map((item) => {
                  const itemIndex = flatItems.findIndex(
                    (f) => f.id === item.id
                  );
                  const isSelected = itemIndex === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        item.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors",
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-md",
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-[11px] font-normal text-slate-400 dark:text-slate-500 truncate">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {item.shortcut && (
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono font-semibold">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono font-semibold">↵</kbd> to select
            </span>
          </div>
          <span>DevFlow Command Hub</span>
        </div>
      </div>
    </div>
  );
}
