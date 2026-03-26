import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Users,
  MapPin,
  Link2,
  Calendar,
  Activity
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { siteUrl } from "@/utils/meta-data";

type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  created_at: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
};

type GitHubEvent = {
  id: string;
  type: string;
  repo?: { name?: string };
  created_at: string;
  payload?: { commits?: { sha: string }[] };
};

const GITHUB_USERNAME = "rahulkumar-techo";
const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_AVATAR = `https://github.com/${GITHUB_USERNAME}.png?size=420`;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "GitHub Profile | Rahul Kumar",
  description:
    "Explore Rahul Kumar's GitHub profile, repositories, recent contributions, and open-source activity.",
  alternates: {
    canonical: `${siteUrl}/github`
  },
  openGraph: {
    title: "GitHub Profile | Rahul Kumar",
    description:
      "GitHub overview with repositories, contributions, and open-source highlights.",
    url: `${siteUrl}/github`,
    type: "website",
    images: [
      {
        url: GITHUB_AVATAR,
        width: 1200,
        height: 630,
        alt: "Rahul Kumar GitHub profile"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Profile | Rahul Kumar",
    description:
      "Repositories, contributions, and open-source highlights from Rahul Kumar.",
    images: [GITHUB_AVATAR]
  }
};

const fallbackProfile: GitHubUser = {
  login: GITHUB_USERNAME,
  name: "Rahul Kumar",
  bio: "Full Stack Developer sharing projects and open-source work on GitHub.",
  avatar_url: GITHUB_AVATAR,
  html_url: GITHUB_PROFILE,
  public_repos: 0,
  followers: 0,
  following: 0,
  location: "India",
  blog: siteUrl,
  created_at: "2020-01-01T00:00:00.000Z"
};

const fallbackRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "portfolio",
    description: "Personal portfolio with projects, blogs, and creative showcases.",
    html_url: `${GITHUB_PROFILE}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    updated_at: "2026-03-01T00:00:00.000Z",
    fork: false
  }
];

async function fetchGitHubUser() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      next: { revalidate }
    });
    if (!res.ok) return null;
    return (await res.json()) as GitHubUser;
  } catch {
    return null;
  }
}

async function fetchGitHubRepos() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=9&sort=updated`,
      {
        next: { revalidate }
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as GitHubRepo[];
  } catch {
    return null;
  }
}

async function fetchGitHubEvents() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`,
      {
        next: { revalidate }
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as GitHubEvent[];
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function labelEvent(event: GitHubEvent) {
  switch (event.type) {
    case "PushEvent":
      return "Pushed commits";
    case "PullRequestEvent":
      return "Opened a pull request";
    case "IssuesEvent":
      return "Opened an issue";
    case "CreateEvent":
      return "Created a repository";
    default:
      return "Activity";
  }
}

export default async function GitHubPage() {
  const [profileData, reposData, eventsData] = await Promise.all([
    fetchGitHubUser(),
    fetchGitHubRepos(),
    fetchGitHubEvents()
  ]);

  const profile = profileData ?? fallbackProfile;
  const repos =
    reposData?.filter((repo) => !repo.fork).slice(0, 6) ?? fallbackRepos;
  const events = eventsData ?? [];
  const contributionCount = events.filter((event) =>
    ["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type)
  ).length;
  const blogUrl =
    profile.blog && profile.blog.trim().length > 0
      ? profile.blog.startsWith("http")
        ? profile.blog
        : `https://${profile.blog}`
      : null;

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex flex-wrap items-start gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                  <Image
                    src={profile.avatar_url || GITHUB_AVATAR}
                    alt={`${profile.name ?? profile.login} avatar`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    GitHub Overview
                  </p>
                  <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
                    {profile.name ?? "Rahul Kumar"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                      @{profile.login}
                    </span>
                    {profile.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(profile.created_at)}
                    </span>
                  </div>
                  <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {profile.bio ??
                      "Full Stack Developer sharing projects and open-source work on GitHub."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={GITHUB_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
                >
                  <Github className="h-4 w-4" />
                  Visit GitHub
                </Link>
                <Link
                  href={`${GITHUB_PROFILE}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  See All Repos
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Public Repos",
                    value: profile.public_repos,
                    icon: <Github className="h-4 w-4 text-indigo-600" />
                  },
                  {
                    label: "Followers",
                    value: profile.followers,
                    icon: <Users className="h-4 w-4 text-cyan-600" />
                  },
                  {
                    label: "Following",
                    value: profile.following,
                    icon: <Users className="h-4 w-4 text-emerald-600" />
                  },
                  {
                    label: "Recent Contributions",
                    value: contributionCount,
                    icon: <Activity className="h-4 w-4 text-rose-500" />
                  }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        {stat.label}
                      </p>
                      {stat.icon}
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Profile Links
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    Quick Access
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Jump directly to the most useful GitHub sections.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    label: "GitHub Profile",
                    href: GITHUB_PROFILE,
                    icon: <Github className="h-4 w-4 text-slate-700" />
                  },
                  {
                    label: "Repositories",
                    href: `${GITHUB_PROFILE}?tab=repositories`,
                    icon: <Link2 className="h-4 w-4 text-slate-700" />
                  },
                  {
                    label: "Stars",
                    href: `${GITHUB_PROFILE}?tab=stars`,
                    icon: <Star className="h-4 w-4 text-slate-700" />
                  },
                  {
                    label: "Activity",
                    href: `${GITHUB_PROFILE}?tab=overview`,
                    icon: <Activity className="h-4 w-4 text-slate-700" />
                  }
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-transform hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Bio</p>
                <p className="mt-2">
                  {profile.bio ??
                    "Full Stack Developer sharing projects and open-source work on GitHub."}
                </p>
              </div>

              {blogUrl ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Website
                  </p>
                  <Link
                    href={blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                  >
                    {blogUrl}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Repositories
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    Latest Projects
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    A snapshot of recently updated repositories.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {repos.map((repo) => (
                  <Link
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-transform hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {repo.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {repo.description ?? "Open-source repository."}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {repo.language ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          {repo.language}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3" /> {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {repo.forks_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        Updated {formatDate(repo.updated_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Contributions
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Latest public GitHub events and updates.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {events.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No recent public activity found.
                  </div>
                ) : (
                  events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {labelEvent(event)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {event.repo?.name ?? "GitHub"}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(event.created_at)}
                        </span>
                      </div>
                      {event.payload?.commits?.length ? (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {event.payload.commits.length} commit
                          {event.payload.commits.length > 1 ? "s" : ""}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
