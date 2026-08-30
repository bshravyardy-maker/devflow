"use client";

import { Activity, GithubAccount, GithubRepository } from "@/types/dashboard";

/**
 * GitHub integration service.
 *
 * Two clearly separated concerns live here:
 *
 *  - Live: read-only calls to the GitHub public REST API (`api.github.com`).
 *    Only PUBLIC information is read — no OAuth, no credentials, no private
 *    repositories, no private activity. No token is ever required.
 *  - Fallback: deterministic demo data used ONLY when the public API is
 *    unreachable (offline, rate-limited, server error, or account not found)
 *    so the dashboard never breaks. Fallback is always labelled as such.
 *
 * UI components never talk to the API directly; they consume the normalized
 * `GithubAccount` / `GithubRepository` shapes exposed by `connectGithub()`.
 */

export const GITHUB_USERNAME = "bshravyardy-maker";
export const GITHUB_API_BASE = "https://api.github.com";

const REPOS_PER_PAGE = 100;
const API_TIMEOUT_MS = 8000;

export type GithubFetchErrorCode =
  | "network"
  | "rate_limited"
  | "not_found"
  | "server";

export interface GithubConnectResult {
  kind: "live" | "fallback";
  account: GithubAccount;
  repositories: GithubRepository[];
  activity: Omit<Activity, "id" | "timestamp">[];
  /** Non-null when the live API could not be used and demo data was shown. */
  notice: string | null;
}

class GithubFetchError extends Error {
  code: GithubFetchErrorCode;
  constructor(code: GithubFetchErrorCode) {
    super(code);
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Live GitHub public API
// ---------------------------------------------------------------------------

interface RawGithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface RawGithubRepository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

async function githubFetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      signal: controller.signal,
    });
    if (res.status === 403) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") throw new GithubFetchError("rate_limited");
      throw new GithubFetchError("server");
    }
    if (res.status === 404) throw new GithubFetchError("not_found");
    if (!res.ok) throw new GithubFetchError("server");
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof GithubFetchError) throw err;
    throw new GithubFetchError("network");
  } finally {
    clearTimeout(timeout);
  }
}

/** Renders an ISO date as a friendly "Updated …" label. */
function formatUpdatedAt(iso: string): string {
  const then = new Date(iso);
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor((Date.now() - then.getTime()) / dayMs);
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  return `Updated ${then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function mapRepositories(raw: RawGithubRepository[]): GithubRepository[] {
  return raw
    .filter((repo) => !repo.name.startsWith("."))
    .map((repo) => ({
      id: String(repo.id),
      name: repo.name,
      description: repo.description || "",
      // /users/{user}/repos only ever returns public repositories.
      visibility: "public" as const,
      primaryLanguage: repo.language || "",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: formatUpdatedAt(repo.updated_at),
      url: repo.html_url,
    }));
}

function topLanguages(repos: RawGithubRepository[]): string[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([lang]) => lang);
}

function mapAccount(
  profile: RawGithubProfile,
  repos: RawGithubRepository[]
): GithubAccount {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  return {
    username: profile.login,
    displayName: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
    bio: profile.bio || undefined,
    profileUrl: profile.html_url,
    repositories: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    // GitHub's public API does not expose an unauthenticated contribution
    // count, so this surfaces a REAL derived metric instead: total stars
    // across the user's public repositories. Shown in the UI as "Stars".
    publicContributions: totalStars,
    primaryLanguages: topLanguages(repos),
    connectedAt: new Date().toISOString(),
    connectedLabel: "Connected just now",
    dataSource: "live",
  };
}

/**
 * Builds an activity timeline entry strictly from PUBLIC repository facts
 * (repository name + its public updated timestamp). No private events are
 * ever claimed.
 */
function buildGithubActivity(repos: GithubRepository[]): Omit<Activity, "id" | "timestamp">[] {
  return repos.slice(0, 3).map((repo) => ({
    type: "github_repo",
    description: `Public repository updated: ${repo.name}`,
    target: repo.name,
    iconType: "git",
    source: "github",
  }));
}

function noticeFor(code: GithubFetchErrorCode): string {
  switch (code) {
    case "network":
      return "GitHub API unreachable — showing offline demo data.";
    case "rate_limited":
      return "GitHub API rate limit reached — showing offline demo data.";
    case "not_found":
      return `Public profile not found for @${GITHUB_USERNAME} — showing offline demo data.`;
    default:
      return "GitHub API returned an error — showing offline demo data.";
  }
}

// ---------------------------------------------------------------------------
// Fallback (mock) data — only displayed when the live API is unavailable.
// Values reflect the account's known PUBLIC facts; nothing is invented.
// ---------------------------------------------------------------------------

export const MOCK_GITHUB_ACCOUNT: GithubAccount = {
  username: GITHUB_USERNAME,
  displayName: "SHRAVYA REDDY",
  repositories: 18,
  followers: 1,
  following: 1,
  publicContributions: 0, // Stars across public repos are unknown offline → 0, not fabricated.
  primaryLanguages: [],
  connectedAt: new Date().toISOString(),
  connectedLabel: "Connected just now",
  dataSource: "fallback",
};

// Real public repository names from the account. `url` is intentionally left
// unset so the UI never links to a URL we did not receive from GitHub.
export const MOCK_GITHUB_REPOSITORIES: GithubRepository[] = [
  {
    id: "mock-1",
    name: "tic-tac-toe",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
  {
    id: "mock-2",
    name: "Breakout-Game",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
  {
    id: "mock-3",
    name: "classic-snakegame",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
  {
    id: "mock-4",
    name: "Dot-and-Box",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
  {
    id: "mock-5",
    name: "NoteVault",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
  {
    id: "mock-6",
    name: "SOS-Game",
    description: "",
    visibility: "public",
    primaryLanguage: "",
    stars: 0,
    forks: 0,
    updatedAt: "—",
  },
];

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

/**
 * Connects to the GitHub account for the given username using ONLY public
 * GitHub API data. Resolves with live data, or falls back to demo data (with
 * an explanatory notice) when the API cannot be reached.
 */
export async function connectGithub(
  username: string
): Promise<GithubConnectResult> {
  const encoded = encodeURIComponent(username);
  try {
    const [profile, repos] = await Promise.all([
      githubFetch<RawGithubProfile>(`/users/${encoded}`),
      githubFetch<RawGithubRepository[]>(
        `/users/${encoded}/repos?per_page=${REPOS_PER_PAGE}&sort=updated`
      ),
    ]);

    const repositories = mapRepositories(repos).slice(0, 30);
    return {
      kind: "live",
      account: mapAccount(profile, repos),
      repositories,
      activity: buildGithubActivity(repositories),
      notice: null,
    };
  } catch (err) {
    const code: GithubFetchErrorCode =
      err instanceof GithubFetchError ? err.code : "network";
    return {
      kind: "fallback",
      account: { ...MOCK_GITHUB_ACCOUNT },
      repositories: MOCK_GITHUB_REPOSITORIES.map((repo) => ({ ...repo })),
      activity: buildGithubActivity(MOCK_GITHUB_REPOSITORIES),
      notice: noticeFor(code),
    };
  }
}

/**
 * Disconnects the GitHub integration. There is no server-side session to
 * revoke (no OAuth), so this just resolves after a short delay to mirror a
 * sign-out round-trip.
 */
export function disconnectGithub(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
}