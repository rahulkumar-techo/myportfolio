import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth";
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository";
import { slugify } from "@/utils/slugify";
import { estimateReadingTime } from "@/lib/blog";

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function resolveCoverImage(value: any) {
  if (!value) return null;
  if (typeof value === "string") {
    return value.trim().length > 0 ? { url: value.trim() } : null;
  }
  if (typeof value.url === "string" && value.url.trim().length > 0) {
    return { ...value, url: value.url.trim() };
  }
  return null;
}

export async function GET() {
  const blogs = await listPortfolioItems("blogs");

  return NextResponse.json({
    success: true,
    data: blogs,
    meta: {
      total: blogs.length,
      timestamp: new Date().toISOString()
    }
  });
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminApiSession();

  if (response || !session) {
    return response;
  }

  const body = await request.json().catch(() => ({} as any));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!title || !description || !content) {
    return NextResponse.json(
      { success: false, error: "Title, description, and content are required." },
      { status: 400 }
    );
  }

  const coverImage = resolveCoverImage(body.coverImage ?? body.coverImageUrl);
  const tags = normalizeTags(body.tags);
  const readingTime = typeof body?.readingTime === "string" && body.readingTime.trim().length > 0
    ? body.readingTime.trim()
    : estimateReadingTime(content);

  const newBlog = {
    id: crypto.randomUUID(),
    title,
    slug: body.slug ? slugify(body.slug) : slugify(title),
    description,
    content,
    tags,
    coverImage,
    readingTime,
    featured: Boolean(body?.featured),
    createdAt: new Date(),
    publishedAt: body?.publishedAt ? new Date(body.publishedAt) : new Date()
  };

  const created = await createPortfolioItem("blogs", newBlog, session.user.id);

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
