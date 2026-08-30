"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { TaskDetailDialog } from "@/components/dashboard/task-detail-dialog";
import { ToastContainer } from "@/components/ui/toast";
import { useDashboard } from "@/context/dashboard-context";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { toasts, dismissToast } = useDashboard();

  useKeyboardShortcuts();

  return (
    <div className="flex min-h-screen w-full bg-slate-50/60 text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar (Fixed on left for lg screens) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        {/* Top Header */}
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <CommandPalette />
      <TaskDetailDialog />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
