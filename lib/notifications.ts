export type NotificationFeedEntry = {
  type: "project" | "blog" | "asset";
  title: string;
  createdAt: string;
};

export const READ_STORAGE_KEY = "portfolio:notification-read";

export function safeParseIds(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function entryId(entry: NotificationFeedEntry) {
  const stamp = entry.createdAt ? new Date(entry.createdAt).toISOString() : "unknown";
  return `${entry.type}:${stamp}:${entry.title}`;
}
