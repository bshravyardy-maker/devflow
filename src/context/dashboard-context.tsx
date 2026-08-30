"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Project,
  Task,
  Activity,
  StatItem,
  UserProfile,
  TaskFilter,
  TaskStatus,
  ThemeMode,
  FocusSession,
  NotificationItem,
  ProductivityGoal,
  ToastMessage,
  GithubConnectionState,
  GithubAccount,
  GithubRepository,
} from "@/types/dashboard";
import {
  initialProjects,
  initialTasks,
  initialActivities,
  initialStats,
  mockUser,
  initialGoals,
  initialNotifications,
  initialFocusSessions,
  historicalCompletedTasks,
} from "@/data/mock-data";
import {
  connectGithub as connectGithubService,
  disconnectGithub as disconnectGithubService,
  GITHUB_USERNAME,
} from "@/services/github-service";

const PROFILE_STORAGE_KEY = "devflow-profile";
const GITHUB_STORAGE_KEY = "devflow-github";

interface PersistedGithub {
  state: GithubConnectionState;
  account: GithubAccount | null;
  repositories: GithubRepository[];
  notice: string | null;
}

export type GithubDataSource = "live" | "fallback" | null;

interface DashboardContextType {
  user: UserProfile;
  updateUserProfile: (fields: Partial<UserProfile>) => void;
  stats: StatItem[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  taskFilter: TaskFilter;
  setTaskFilter: (filter: TaskFilter) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  toggleTaskStatus: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (updatedProject: Project) => void;
  simulateLoading: () => void;
  simulateError: () => void;
  retryFetch: () => void;
  resetData: () => void;
  filteredProjects: Project[];
  filteredTasks: Task[];

  // Theme
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;

  // Focus Mode
  focusSessions: FocusSession[];
  completeFocusSession: (
    session: Omit<FocusSession, "id" | "completedAt">
  ) => void;
  isFocusTimerOpen: boolean;
  setIsFocusTimerOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;

  // Goals
  goals: ProductivityGoal[];
  updateGoalTarget: (goalId: string, newTarget: number) => void;

  // Modals & Dialogs State
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNewTaskOpen: boolean;
  setIsNewTaskOpen: (open: boolean) => void;
  isNewProjectOpen: boolean;
  setIsNewProjectOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  dismissToast: (id: string) => void;

  // GitHub Integration
  githubState: GithubConnectionState;
  githubAccount: GithubAccount | null;
  githubRepositories: GithubRepository[];
  githubDataStatus: GithubDataSource;
  githubNotice: string | null;
  connectGithub: () => void;
  disconnectGithub: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  // Theme State
  const [theme, setThemeState] = useState<ThemeMode>("system");

  // Focus State
  const [focusSessions, setFocusSessions] =
    useState<FocusSession[]>(initialFocusSessions);
  const [additionalFocusMinutes, setAdditionalFocusMinutes] =
    useState<number>(0);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);

  // Dialogs & Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Notifications & Goals
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [goals, setGoals] = useState<ProductivityGoal[]>(initialGoals);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // GitHub Integration
  const [githubState, setGithubState] = useState<GithubConnectionState>(
    "not_connected"
  );
  const [githubAccount, setGithubAccount] = useState<GithubAccount | null>(null);
  const [githubRepositories, setGithubRepositories] = useState<
    GithubRepository[]
  >([]);
  const [githubDataStatus, setGithubDataStatus] =
    useState<GithubDataSource>(null);
  const [githubNotice, setGithubNotice] = useState<string | null>(null);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hydrate persisted profile + GitHub connection after first render. Kept in an
  // effect (not a lazy initializer) so SSR and the first client render match,
  // avoiding hydration mismatches while still surviving a refresh in the demo.
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<UserProfile>;
        setUser((prev) => ({
          ...prev,
          ...parsed,
          preferences: {
            ...mockUser.preferences,
            ...(parsed.preferences || {}),
          },
        }));
      }
    } catch {
      // Ignore parse errors
    }
    try {
      const savedGithub = localStorage.getItem(GITHUB_STORAGE_KEY);
      if (savedGithub) {
        const parsed = JSON.parse(savedGithub) as PersistedGithub;
        if (parsed.state === "connected" && parsed.account) {
          setGithubState("connected");
          setGithubAccount(parsed.account);
          setGithubRepositories(parsed.repositories || []);
          setGithubDataStatus(parsed.account.dataSource || null);
          setGithubNotice(parsed.notice || null);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const persistProfile = useCallback((profile: UserProfile) => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage write failures
    }
  }, []);

  const persistGithub = useCallback(
    (
      state: GithubConnectionState,
      account: GithubAccount | null,
      repositories: GithubRepository[],
      notice: string | null = null
    ) => {
      try {
        const payload: PersistedGithub = {
          state,
          account,
          repositories,
          notice,
        };
        localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage write failures
      }
    },
    []
  );

  const updateUserProfile = useCallback(
    (fields: Partial<UserProfile>) => {
      setUser((prev) => {
        const next = { ...prev, ...fields };
        persistProfile(next);
        return next;
      });
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "project_updated",
          description: "Updated your developer profile",
          target: "Profile",
          timestamp: "Just now",
          iconType: "edit",
        },
        ...prev.slice(0, 9),
      ]);
      showToast("Profile updated successfully", "success");
    },
    [persistProfile, showToast]
  );

  const connectGithub = useCallback(async () => {
    setGithubState("connecting");
    const result = await connectGithubService(GITHUB_USERNAME);
    setGithubAccount(result.account);
    setGithubRepositories(result.repositories);
    setGithubDataStatus(result.kind);
    setGithubNotice(result.notice);
    setGithubState("connected");
    persistGithub("connected", result.account, result.repositories, result.notice);
    setActivities((prev) => [
      ...result.activity.map((act, idx) => ({
        ...act,
        id: `gh-${Date.now()}-${idx}`,
        timestamp: "Just now",
      })),
      ...prev.slice(0, 9),
    ]);
    if (result.kind === "live") {
      showToast("Connected to GitHub via public API", "success");
    } else {
      showToast(
        "Connected to GitHub (demo data — API unavailable)",
        "info"
      );
    }
  }, [persistGithub, showToast]);

  const disconnectGithub = useCallback(() => {
    setGithubState("disconnecting");
    disconnectGithubService()
      .then(() => {
        setGithubAccount(null);
        setGithubRepositories([]);
        setGithubDataStatus(null);
        setGithubNotice(null);
        setGithubState("not_connected");
        persistGithub("not_connected", null, [], null);
        setActivities((prev) => prev.filter((act) => act.source !== "github"));
        showToast("GitHub account disconnected", "info");
      })
      .catch(() => {
        setGithubState("error");
        showToast("Could not disconnect GitHub", "error");
      });
  }, [persistGithub, showToast]);

  // Theme Init & Sync
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("devflow-theme") as ThemeMode | null;
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("devflow-theme", newTheme);
    } catch {
      // Ignore
    }
  }, []);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic stats calculation
  const stats: StatItem[] = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const activeProjects = projects.filter((p) => p.status !== "Completed").length;

    const baseFocusHours = 32.5;
    const extraHours = parseFloat((additionalFocusMinutes / 60).toFixed(1));
    const totalFocusHours = (baseFocusHours + extraHours).toFixed(1);

    return initialStats.map((stat) => {
      if (stat.id === "stat-1") {
        return {
          ...stat,
          value: activeProjects,
          supportingText: `${Math.max(0, projects.length - activeProjects)} completed`,
        };
      }
      if (stat.id === "stat-2") {
        return {
          ...stat,
          value: total,
          supportingText: `${
            tasks.filter((t) => t.dueDate === "Today" || t.dueDate === "Tomorrow").length
          } due soon`,
        };
      }
      if (stat.id === "stat-3") {
        const trendVal: "positive" | "neutral" = rate >= 60 ? "positive" : "neutral";
        return {
          ...stat,
          value: `${rate}%`,
          supportingText: rate >= 60 ? "+8% from last month" : "Needs attention",
          trend: trendVal,
        };
      }
      if (stat.id === "stat-4") {
        return {
          ...stat,
          value: `${totalFocusHours}h`,
          supportingText: `+${(4.2 + extraHours).toFixed(1)}h this week`,
          trend: "positive" as const,
        };
      }
      return stat;
    });
  }, [tasks, projects, additionalFocusMinutes]);

  // Sync projects with tasks dynamically. The task list is a representative
  // subset of each project's full backlog, so we preserve the declared total
  // task count and map the observed completion ratio onto it rather than
  // clobbering it. Declared-completed projects are never downgraded by
  // partial data.
  const syncProjectsWithTasks = useCallback((currentTasks: Task[]) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        const projTasks = currentTasks.filter(
          (t) => t.projectId === p.id || t.projectName === p.name
        );
        if (projTasks.length === 0) return p;

        if (p.status === "Completed") {
          const allObservedDone = projTasks.every(
            (t) => t.status === "completed"
          );
          if (allObservedDone) {
            return { ...p, completedTasks: p.totalTasks, progress: 100 };
          }
        }

        const comp = projTasks.filter((t) => t.status === "completed").length;
        const total = projTasks.length;
        const ratio = comp / total;
        const mappedCompleted =
          p.totalTasks > 0
            ? Math.min(p.totalTasks, Math.round(ratio * p.totalTasks))
            : comp;
        const progress =
          p.totalTasks > 0
            ? Math.round((mappedCompleted / p.totalTasks) * 100)
            : Math.round(ratio * 100);

        return {
          ...p,
          completedTasks: mappedCompleted,
          totalTasks: p.totalTasks,
          progress,
          status:
            progress === 100
              ? "Completed"
              : progress > 0
              ? "In Progress"
              : p.status,
        };
      })
    );
  }, []);

  // Update goals dynamically
  useEffect(() => {
    const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
    const completedProjectsCount = projects.filter((p) => p.status === "Completed").length;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.type === "tasks") {
          return { ...g, current: Math.min(g.target, completedTasksCount + historicalCompletedTasks) };
        }
        if (g.type === "focus") {
          const focusHrs = Math.round(15 + additionalFocusMinutes / 60);
          return { ...g, current: focusHrs };
        }
        if (g.type === "projects") {
          return { ...g, current: completedProjectsCount };
        }
        return g;
      })
    );
  }, [tasks, projects, additionalFocusMinutes]);

  const addNotification = useCallback(
    (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
      const created: NotificationItem = {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: "Just now",
        read: false,
      };
      setNotifications((prev) => [created, ...prev]);
    },
    []
  );

  const toggleTaskStatus = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        const updated = prev.map((task) => {
          if (task.id === taskId) {
            const nextStatus: TaskStatus =
              task.status === "completed" ? "todo" : "completed";

            const act: Activity = {
              id: `act-${Date.now()}`,
              type:
                nextStatus === "completed" ? "task_completed" : "task_added",
              description:
                nextStatus === "completed"
                  ? `Completed "${task.title}"`
                  : `Reopened "${task.title}"`,
              target: task.projectName,
              timestamp: "Just now",
              iconType: nextStatus === "completed" ? "check" : "edit",
              projectId: task.projectId,
              taskId: task.id,
            };
            setActivities((a) => [act, ...a.slice(0, 9)]);

            if (nextStatus === "completed") {
              addNotification({
                title: "Task completed",
                message: `Completed "${task.title}" in ${task.projectName}`,
                type: "task_completed",
              });
              showToast(`Task completed: "${task.title}"`, "success");
            } else {
              showToast(`Task reopened: "${task.title}"`, "info");
            }

            return { ...task, status: nextStatus };
          }
          return task;
        });
        syncProjectsWithTasks(updated);
        return updated;
      });
    },
    [syncProjectsWithTasks, addNotification, showToast]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        );
        syncProjectsWithTasks(updated);
        return updated;
      });
    },
    [syncProjectsWithTasks]
  );

  const updateTask = useCallback(
    (updatedTask: Task) => {
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
        syncProjectsWithTasks(updated);
        return updated;
      });
      showToast(`Updated "${updatedTask.title}"`, "success");
    },
    [syncProjectsWithTasks, showToast]
  );

  const addTask = useCallback(
    (newTask: Omit<Task, "id" | "createdAt">) => {
      const created: Task = {
        ...newTask,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => {
        const updated = [created, ...prev];
        syncProjectsWithTasks(updated);
        return updated;
      });
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "task_added",
          description: `Added task "${created.title}"`,
          target: created.projectName,
          timestamp: "Just now",
          iconType: "plus",
          projectId: created.projectId,
          taskId: created.id,
        },
        ...prev.slice(0, 9),
      ]);
      showToast(`Created task: "${created.title}"`, "success");
    },
    [syncProjectsWithTasks, showToast]
  );

  const addProject = useCallback(
    (newProject: Omit<Project, "id">) => {
      const created: Project = {
        ...newProject,
        id: `proj-${Date.now()}`,
      };
      setProjects((prev) => [created, ...prev]);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "project_updated",
          description: `Created new project "${created.name}"`,
          target: created.name,
          timestamp: "Just now",
          iconType: "folder",
          projectId: created.id,
        },
        ...prev.slice(0, 9),
      ]);
      showToast(`Created project: "${created.name}"`, "success");
    },
    [showToast]
  );

  const updateProject = useCallback(
    (updatedProject: Project) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      showToast(`Updated project "${updatedProject.name}"`, "success");
    },
    [showToast]
  );

  // Focus Session Complete Handler
  const completeFocusSession = useCallback(
    (session: Omit<FocusSession, "id" | "completedAt">) => {
      const newSession: FocusSession = {
        ...session,
        id: `session-${Date.now()}`,
        completedAt: new Date().toISOString(),
      };

      setFocusSessions((prev) => [newSession, ...prev]);
      if (session.sessionType === "focus") {
        setAdditionalFocusMinutes((prev) => prev + session.durationMinutes);

        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            type: "focus_completed",
            description: `Finished 25m focus sprint on "${
              session.taskTitle || "Engineering task"
            }"`,
            target: session.projectName || "DevFlow",
            timestamp: "Just now",
            iconType: "zap",
            projectId: session.taskId,
          },
          ...prev.slice(0, 9),
        ]);

        addNotification({
          title: "Focus session completed! ⚡",
          message: `Logged ${session.durationMinutes}m focus time for "${
            session.taskTitle || "Focus Session"
          }".`,
          type: "focus_completed",
        });

        showToast(
          `Focus session logged! +${session.durationMinutes}m deep work`,
          "success"
        );
      }
    },
    [addNotification, showToast]
  );

  // Notification Actions
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read", "info");
  }, [showToast]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    showToast("Notifications cleared", "info");
  }, [showToast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Goal Actions
  const updateGoalTarget = useCallback(
    (goalId: string, newTarget: number) => {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, target: newTarget } : g))
      );
      showToast("Productivity goal target updated", "success");
    },
    [showToast]
  );

  const simulateLoading = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const simulateError = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(
        "We couldn't load your projects & workspace data. Please check your network and try again."
      );
    }, 600);
  }, []);

  const retryFetch = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  const resetData = useCallback(() => {
    setProjects(initialProjects);
    setTasks(initialTasks);
    setActivities(initialActivities);
    setFocusSessions(initialFocusSessions);
    setAdditionalFocusMinutes(0);
    setNotifications(initialNotifications);
    setGoals(initialGoals);
    setSearchQuery("");
    setTaskFilter("all");
    setIsError(false);
    setErrorMessage(null);
    showToast("Dataset reset to defaults", "info");
  }, [showToast]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (taskFilter === "todo" && t.status !== "todo") return false;
      if (taskFilter === "in_progress" && t.status !== "in_progress")
        return false;
      if (taskFilter === "completed" && t.status !== "completed") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesProject = t.projectName.toLowerCase().includes(q);
        const matchesPriority = t.priority.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProject && !matchesPriority) return false;
      }

      return true;
    });
  }, [tasks, taskFilter, searchQuery]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        updateUserProfile,
        stats,
        projects,
        tasks,
        activities,
        searchQuery,
        setSearchQuery,
        taskFilter,
        setTaskFilter,
        isLoading,
        isError,
        errorMessage,
        toggleTaskStatus,
        updateTaskStatus,
        updateTask,
        addTask,
        addProject,
        updateProject,
        simulateLoading,
        simulateError,
        retryFetch,
        resetData,
        filteredProjects,
        filteredTasks,
        theme,
        setTheme,
        focusSessions,
        completeFocusSession,
        isFocusTimerOpen,
        setIsFocusTimerOpen,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
        goals,
        updateGoalTarget,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNewTaskOpen,
        setIsNewTaskOpen,
        isNewProjectOpen,
        setIsNewProjectOpen,
        selectedTask,
        setSelectedTask,
        toasts,
        showToast,
        dismissToast,
        githubState,
        githubAccount,
        githubRepositories,
        githubDataStatus,
        githubNotice,
        connectGithub,
        disconnectGithub,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
