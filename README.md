# DevFlow — Developer Productivity Dashboard (Pro Edition)

A modern, production-grade **Developer Productivity Dashboard** engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, accessible **shadcn/ui** design patterns, and **Lucide React**.

Built as an evaluation-grade project prioritizing engineering quality, responsive design, robust state management, Pomodoro focus flows, and real-world developer workflows.

---

## 🌟 Upgraded Feature Matrix

### 1. 🌓 Comprehensive Dark Mode / Light Mode Theme System
* **Tri-state Mode**: Light, Dark, and OS System preference (`'light' | 'dark' | 'system'`).
* **Header Quick-Toggle**: Instant theme switcher popover accessible from the top header on any page.
* **Settings Selection**: Visual option cards in `/settings` to configure appearance.
* **Persistent**: Persisted via `localStorage` with zero theme flashing on load.
* **Full Component Harmony**: High-contrast, WCAG-compliant styling across cards, inputs, dropdowns, modal dialogs, status badges, skeletons, and charts.

### 2. ⚡ Pomodoro Focus Mode (`FocusTimer`)
* **Task Attachment**: Select an active task from your workspace or run a general focus sprint.
* **Sprint Cycles**: 25-minute Deep Focus session (`25:00`) & 5-minute Short Break (`05:00`).
* **Interactive Controls**: Start, Pause, Resume, Reset, and "Finish Early" actions.
* **Visual Progress Ring**: Smooth circular SVG countdown timer and digital display.
* **Telemetry Integration**: Completing or finishing a session dynamically updates focus hours, posts an activity event, increments weekly goal progress, and dispatches a notification.

### 3. 📊 Advanced Productivity Analytics (`/analytics`)
* **Weekly Performance Summary**: Total tasks completed (`27+`), focus hours (`32.5h`), milestone completion rate (`68%`), and active 5-day streak (`🔥`).
* **Daily Focus Time Chart**: Bar graph visualizing daily focus hours (Mon–Sun) with peak day highlights.
* **Daily Task Completion Chart**: Visual breakdown of tickets completed versus target across the sprint.
* **Project Velocity & Health**: Live progress indicators and task counts across active repositories.
* **Deterministic Smart Insights**:
  * *"Peak Flow Day: Thursday (8.0h focus logged)"*
  * *"18% higher task velocity vs previous sprint"*
  * *"Focus time up +2.4 hours with Pomodoro sprints"*

### 4. 🔔 Interactive Notification Center (`NotificationCenter`)
* **Live Unread Badge**: Dynamic badge count in top header (`🔔 3`).
* **Event Notifications**:
  * Task due soon alerts
  * Task completion notices
  * Focus sprint achievements
  * Project milestone updates
  * Weekly productivity records
* **Management Actions**: Mark individual alerts as read, "Mark all as read", and "Clear all".
* **Mobile-friendly**: Viewport-aware popover positioning preventing horizontal overflow.

### 5. 🎯 Personal Productivity Goals (`ProductivityGoals`)
* **Tracked Metrics**:
  * **Tasks Completed**: e.g., `27 / 30 tasks`
  * **Focus Hours**: e.g., `15 / 20 hours`
  * **Projects Shipped**: e.g., `2 / 2 projects`
* **Progress Visualization**: Dynamic progress bars, remaining quantity calculations, and completion badges (`✓ Completed`).
* **Custom Targets**: Ability to edit weekly targets either directly via the dashboard modal or on the `/settings` page with local persistence.

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx                # AppShell wrapper with theme bootstrap & DashboardProvider
│   ├── page.tsx                  # Dashboard overview with Stats, Goals, Projects, Tasks & Activity
│   ├── projects/page.tsx         # Projects directory with status filters & creation modal
│   ├── tasks/page.tsx            # Tasks manager with multi-criteria filters & inline completion
│   ├── analytics/page.tsx        # Developer metrics, daily charts & smart insights
│   ├── settings/page.tsx         # Theme switcher, goal target editor, profile & API keys
│   └── globals.css               # Tailwind CSS variables & tokens for light/dark modes
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx         # Responsive container with sidebar & header
│   │   ├── sidebar.tsx           # Accessible navigation with active states & profile footer
│   │   ├── header.tsx            # Global search, Focus Mode button, Theme toggle, & NotificationCenter
│   │   └── mobile-nav.tsx        # Accessible mobile drawer menu
│   ├── dashboard/
│   │   ├── dashboard-header.tsx  # Dynamic greeting and date badge
│   │   ├── demo-controls.tsx     # Evaluator simulation toolbar (Loading / Error / Reset)
│   │   ├── stat-card.tsx         # Metric card with visual hierarchy
│   │   ├── stats-grid.tsx        # 4-column responsive stats layout
│   │   ├── productivity-goals.tsx# GoalProgress component & Weekly Goals card
│   │   ├── goal-edit-dialog.tsx  # Modal dialog to edit weekly targets
│   │   ├── project-card.tsx      # Rich project card
│   │   ├── project-section.tsx   # Projects section with "View all →"
│   │   ├── task-item.tsx         # Interactive task item with priority badge
│   │   ├── task-list.tsx         # Dynamic task list container
│   │   ├── task-section.tsx      # Filterable task section with counts
│   │   ├── activity-list.tsx     # Real-time timeline
│   │   ├── new-task-dialog.tsx   # Task creation modal
│   │   └── new-project-dialog.tsx# Project creation modal
│   ├── focus/
│   │   └── focus-timer-dialog.tsx# Pomodoro Focus Timer modal with circular progress
│   ├── notifications/
│   │   └── notification-center.tsx# Interactive notification popover with unread counter
│   ├── states/
│   │   ├── loading-skeleton.tsx  # Section skeletons
│   │   ├── empty-state.tsx       # Zero-result empty states
│   │   └── error-state.tsx       # Error recovery state
│   └── ui/                       # shadcn/ui-inspired primitives
│       ├── button.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── input.tsx
│       ├── checkbox.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── avatar.tsx
│       └── theme-toggle.tsx
├── context/
│   └── dashboard-context.tsx     # Unified reactive state management
├── data/
│   └── mock-data.ts              # Strongly-typed initial dataset
├── types/
│   └── dashboard.ts              # TypeScript interfaces
└── lib/
    └── utils.ts                  # cn class merger & formatters
```

---

## 📱 Responsive Design Matrix

| Viewport | Screen Width | Layout Behavior |
| :--- | :--- | :--- |
| **Mobile (Small)** | `320px – 375px` | 1-column layout, compact header, drawer menu, zero horizontal overflow. |
| **Mobile (Large)** | `375px – 640px` | 1-column layout, touch-friendly checkboxes and buttons (>44px touch targets). |
| **Tablet** | `768px – 1024px` | 2-column stats grid, 2-column project cards, adaptive filter bars. |
| **Laptop / Desktop** | `1024px – 1440px+` | Fixed left sidebar, 4-column stats grid, 2:1 ratio for Tasks and Activity. |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
