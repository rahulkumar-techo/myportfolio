import type { BlogPost } from "@/lib/types";

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

export function estimateReadingTime(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function normalizeBlogPost(raw: any): BlogPost | null {
  if (!raw) return null;
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    slug: String(raw.slug ?? ""),
    description: String(raw.description ?? ""),
    content: String(raw.content ?? ""),
    tags: normalizeTags(raw.tags),
    coverImage: raw.coverImage ?? null,
    readingTime: String(raw.readingTime ?? estimateReadingTime(String(raw.content ?? ""))),
    featured: Boolean(raw.featured),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? null,
    publishedAt: raw.publishedAt ?? null
  };
}

export function normalizeBlogPosts(raw: any): BlogPost[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => normalizeBlogPost(item)).filter(Boolean) as BlogPost[];
}
