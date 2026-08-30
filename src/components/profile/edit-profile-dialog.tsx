"use client";

import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/dashboard-context";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Fields {
  name: string;
  role: string;
  email: string;
  bio: string;
  githubUsername: string;
  location: string;
}

type FieldErrors = Partial<Record<keyof Fields, string>>;

export function EditProfileDialog({ isOpen, onClose }: EditProfileDialogProps) {
  const { user, updateUserProfile } = useDashboard();
  const [fields, setFields] = useState<Fields>({
    name: user.name,
    role: user.role,
    email: user.email,
    bio: user.bio || "",
    githubUsername: user.githubUsername || "",
    location: user.location || "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFields({
        name: user.name,
        role: user.role,
        email: user.email,
        bio: user.bio || "",
        githubUsername: user.githubUsername || "",
        location: user.location || "",
      });
      setErrors({});
      setSaving(false);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const setField = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    if (!fields.name.trim()) nextErrors.name = "Name is required.";
    if (!fields.role.trim()) nextErrors.role = "Role is required.";
    const email = fields.email.trim();
    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (fields.githubUsername.trim() && !/^[a-zA-Z0-9-]+$/.test(fields.githubUsername.trim())) {
      nextErrors.githubUsername = "GitHub username may only contain letters, numbers, and hyphens.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    // Simulate a save round-trip, then persist via context.
    setTimeout(() => {
      updateUserProfile({
        name: fields.name.trim(),
        role: fields.role.trim(),
        email: fields.email.trim(),
        bio: fields.bio.trim(),
        githubUsername: fields.githubUsername.trim(),
        location: fields.location.trim(),
      });
      setSaving(false);
      onClose();
    }, 600);
  };

  const fieldClasses =
    "text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h2 id="edit-profile-title" className="text-base font-semibold text-slate-900 dark:text-white">
              Edit Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div className="flex items-center gap-3 pb-1">
            <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {fields.name.slice(0, 2).toUpperCase() || "PR"}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your avatar is generated from your display name.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ep-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Name
              </label>
              <Input
                id="ep-name"
                value={fields.name}
                onChange={(e) => setField("name", e.target.value)}
                className={fieldClasses}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="ep-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Role
              </label>
              <Input
                id="ep-role"
                value={fields.role}
                onChange={(e) => setField("role", e.target.value)}
                className={fieldClasses}
                aria-invalid={!!errors.role}
              />
              {errors.role && (
                <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.role}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="ep-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <Input
              id="ep-email"
              type="email"
              value={fields.email}
              onChange={(e) => setField("email", e.target.value)}
              className={fieldClasses}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="ep-bio" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bio
            </label>
            <textarea
              id="ep-bio"
              value={fields.bio}
              onChange={(e) => setField("bio", e.target.value)}
              rows={3}
              placeholder="Tell people a little about yourself"
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ep-gh" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub username
              </label>
              <Input
                id="ep-gh"
                value={fields.githubUsername}
                onChange={(e) => setField("githubUsername", e.target.value)}
                placeholder="e.g. bshravyardy-maker"
                className={fieldClasses}
                aria-invalid={!!errors.githubUsername}
              />
              {errors.githubUsername && (
                <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{errors.githubUsername}</p>
              )}
            </div>
            <div>
              <label htmlFor="ep-loc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <Input
                id="ep-loc"
                value={fields.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className={fieldClasses}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saving}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium min-w-[110px]"
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
