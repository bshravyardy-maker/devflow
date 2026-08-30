"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/dashboard-context";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const {
    setIsCommandPaletteOpen,
    setIsNewTaskOpen,
    setIsFocusTimerOpen,
    setTheme,
    theme,
  } = useDashboard();

  const lastKeyRef = useRef<string | null>(null);
  const keyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in form inputs
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // Cmd/Ctrl + K (Always works even inside inputs)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // Ignore standard letter shortcuts if typing in an input field
      if (isInput) return;

      const key = e.key.toLowerCase();

      // N -> Create New Task
      if (key === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsNewTaskOpen(true);
        return;
      }

      // F -> Start Focus Mode
      if (key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsFocusTimerOpen(true);
        return;
      }

      // Sequential 'G then ...' Navigation
      if (lastKeyRef.current === "g") {
        if (key === "d") {
          e.preventDefault();
          router.push("/");
        } else if (key === "t") {
          e.preventDefault();
          router.push("/tasks");
        } else if (key === "p") {
          e.preventDefault();
          router.push("/projects");
        } else if (key === "a") {
          e.preventDefault();
          router.push("/analytics");
        } else if (key === "s") {
          e.preventDefault();
          router.push("/settings");
        }
        lastKeyRef.current = null;
        if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
        return;
      }

      if (key === "g") {
        lastKeyRef.current = "g";
        if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
        keyTimerRef.current = setTimeout(() => {
          lastKeyRef.current = null;
        }, 1200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
    };
  }, [
    router,
    setIsCommandPaletteOpen,
    setIsNewTaskOpen,
    setIsFocusTimerOpen,
    setTheme,
    theme,
  ]);
}
