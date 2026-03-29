"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, BookOpen, CheckCheck, FolderKanban, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { entryId, READ_STORAGE_KEY, safeParseIds } from "@/lib/notifications";

type NotificationType = "project" | "blog" | "asset";

type NotificationEntry = {
  type: NotificationType;
  title: string;
  description: string;
  url?: string;
  createdAt: string;
};

type NotificationFeedProps = {
  entries: NotificationEntry[];
};


const TYPE_META: Record<
  NotificationType,
  { label: string; icon: typeof FolderKanban; chip: string; glow: string; dot: string }
> = {
  project: {
    label: "Project",
    icon: FolderKanban,
    chip: "border-sky-400/30 bg-sky-500/10 text-sky-200",
    glow: "from-sky-500/20 via-indigo-500/10 to-transparent",
    dot: "bg-sky-400"
  },
  blog: {
    label: "Blog",
    icon: BookOpen,
    chip: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    dot: "bg-emerald-400"
  },
  asset: {
    label: "Asset",
    icon: Package,
    chip: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    glow: "from-amber-500/20 via-orange-500/10 to-transparent",
    dot: "bg-amber-400"
  }
};

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationFeed({ entries }: NotificationFeedProps) {
  const [activeTab, setActiveTab] = useState<"all" | "project" | "blog" | "asset">("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = safeParseIds(window.localStorage.getItem(READ_STORAGE_KEY));
    setReadIds(new Set(stored));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(readIds)));
    window.dispatchEvent(new Event("notifications:read-change"));
  }, [hydrated, readIds]);

  const normalizedEntries = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        id: entryId(entry),
        createdAtDate: new Date(entry.createdAt)
      })),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    if (activeTab === "all") return normalizedEntries;
    return normalizedEntries.filter((entry) => entry.type === activeTab);
  }, [activeTab, normalizedEntries]);

  const counts = useMemo(() => {
    const total = normalizedEntries.length;
    const read = normalizedEntries.filter((entry) => readIds.has(entry.id)).length;
    return {
      total,
      read,
      unread: Math.max(total - read, 0),
      progress: total > 0 ? Math.round((read / total) * 100) : 0
    };
  }, [normalizedEntries, readIds]);

  const tabCounts = useMemo(() => {
    return {
      all: normalizedEntries.length,
      project: normalizedEntries.filter((entry) => entry.type === "project").length,
      blog: normalizedEntries.filter((entry) => entry.type === "blog").length,
      asset: normalizedEntries.filter((entry) => entry.type === "asset").length
    };
  }, [normalizedEntries]);

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(new Set(normalizedEntries.map((entry) => entry.id)));
  };

  return (
    <div className="mx-auto w-full max-w-4xl lg:max-w-none">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 shadow-[0_30px_80px_rgba(3,7,18,0.55)] backdrop-blur sm:rounded-3xl">
        <div className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-lg sm:h-12 sm:w-12">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-semibold text-white sm:text-2xl">Notifications</h1>
                  <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold text-sky-200 sm:text-xs">
                    {counts.unread} unread
                  </span>
                </div>
                <p className="text-xs text-slate-400 sm:text-sm">
                  {counts.total} messages · {counts.read} read · {counts.unread} unread
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 text-[11px] font-semibold text-slate-200 hover:bg-white/10 sm:h-9 sm:w-auto sm:text-xs"
                onClick={markAllRead}
                disabled={counts.total === 0}
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            </div>
          </div>

          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all"
              style={{ width: `${counts.progress}%` }}
            />
          </div>
        </div>

        <div className="px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: "all", label: "All", count: tabCounts.all },
              { key: "project", label: "Projects", count: tabCounts.project },
              { key: "blog", label: "Blogs", count: tabCounts.blog },
              { key: "asset", label: "Assets", count: tabCounts.asset }
            ] as const).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold transition sm:px-4 sm:text-xs",
                    isActive
                      ? "border-white/20 bg-white/10 text-white shadow-inner"
                      : "border-white/5 bg-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  {tab.label}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 px-4 pb-6 pt-5 sm:px-6">
          {filteredEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-400">
              No notifications in this tab yet.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const meta = TYPE_META[entry.type];
              const Icon = meta.icon;
              const isRead = readIds.has(entry.id);
              const timeLabel = formatRelativeTime(entry.createdAtDate);
              const href = entry.url?.trim();
              const isExternal = Boolean(href && /^https?:\/\//i.test(href));

              const card = (
                <div
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.45)] transition sm:p-5",
                    isRead ? "opacity-80" : "ring-1 ring-white/10"
                  )}
                  onClick={() => markRead(entry.id)}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition group-hover:opacity-100",
                      meta.glow
                    )}
                  />

                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white sm:h-12 sm:w-12">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white sm:text-base">{entry.title}</h3>
                          {!isRead ? (
                            <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-400 break-words">{entry.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 sm:self-auto">
                      <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                      {timeLabel}
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("border text-[11px] sm:text-xs", meta.chip)}>{meta.label}</Badge>
                      {isRead ? (
                        <span className="text-xs text-slate-500">Read</span>
                      ) : (
                        <span className="text-xs text-slate-300">Unread</span>
                      )}
                    </div>

                    {href ? (
                      <span className="text-xs font-semibold text-slate-200">
                        {isExternal ? "Open link" : "View details"}
                      </span>
                    ) : null}
                  </div>
                </div>
              );

              if (!href) {
                return <div key={entry.id}>{card}</div>;
              }

              if (isExternal) {
                return (
                  <a
                    key={entry.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                );
              }

              return (
                <Link key={entry.id} href={href} className="block">
                  {card}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
