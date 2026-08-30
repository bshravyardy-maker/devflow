export type ProjectStatus = 'In Progress' | 'Completed' | 'Planning' | 'On Hold';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  dueDate: string;
  tags: string[];
  color?: string;
  githubRepo?: string;
  lead?: string;
  startDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  estimatedHours?: number;
  assignee?: string;
}

export interface Activity {
  id: string;
  type:
    | 'task_completed'
    | 'task_added'
    | 'project_updated'
    | 'project_status_changed'
    | 'comment_added'
    | 'focus_completed'
    | 'goal_achieved'
    | 'github_commit'
    | 'github_pr'
    | 'github_repo'
    | 'github_issue';
  description: string;
  target: string;
  timestamp: string;
  iconType: 'check' | 'plus' | 'edit' | 'folder' | 'git' | 'zap' | 'target';
  projectId?: string;
  taskId?: string;
  /** Flags an activity as originating from the (mock) GitHub connection. */
  source?: 'github';
}

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  supportingText: string;
  trend?: 'positive' | 'negative' | 'neutral';
  icon: 'folder' | 'check-square' | 'trending-up' | 'clock';
}

export interface ProfilePreferences {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  showFocusTime: boolean;
  timezone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  email: string;
  bio?: string;
  githubUsername?: string;
  location?: string;
  status: 'online' | 'busy' | 'focus' | 'offline';
  statusText?: string;
  streakDays: number;
  todayFocusHours: number;
  todayCompletedTasks: number;
  preferences: ProfilePreferences;
}

export type GithubConnectionState =
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'error';

export interface GithubAccount {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  profileUrl?: string;
  repositories: number;
  followers: number;
  following: number;
  publicContributions: number;
  primaryLanguages: string[];
  connectedAt: string;
  connectedLabel: string;
  /** "live" = fetched from the GitHub public API; "fallback" = offline demo data. */
  dataSource?: "live" | "fallback";
}

export interface GithubRepository {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  primaryLanguage: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url?: string;
}

export type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  projectName?: string;
  durationMinutes: number;
  completedAt: string;
  sessionType: 'focus' | 'short_break';
}

export type NotificationType =
  | 'task_due'
  | 'task_completed'
  | 'project_completed'
  | 'project_updated'
  | 'milestone'
  | 'focus_completed';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  targetLink?: string;
}

export interface ProductivityGoal {
  id: string;
  type: 'tasks' | 'focus' | 'projects';
  title: string;
  current: number;
  target: number;
  unit: string;
  period: 'weekly' | 'monthly';
}

export interface DailyProductivityMetric {
  day: string;
  dayFull: string;
  tasksCompleted: number;
  tasksTarget: number;
  focusHours: number;
  focusTarget: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
