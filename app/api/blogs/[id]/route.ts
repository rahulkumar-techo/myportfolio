import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth";
import {
  deletePortfolioItemById,
  getPortfolioItemById,
  listPortfolioItems,
  updatePortfolioItemById
} from "@/repositories/portfolio-repository";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let blog = await getPortfolioItemById("blogs", id);

  if (!blog) {
    const blogs = await listPortfolioItems("blogs");
    blog = blogs.find((item: any) => item?.slug === id) ?? null;
  }

  if (!blog) {
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: blog });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { session, response } = await requireAdminApiSession();

  if (response || !session) {
    return response;
  }

  const body = await request.json().catch(() => ({} as any));
  const updates: Record<string, unknown> = { ...body };

  if (typeof body?.title === "string" && !body?.slug) {
    updates.slug = slugify(body.title);
  }

  if ("tags" in body) {
    updates.tags = normalizeTags(body.tags);
  }

  if ("coverImage" in body || "coverImageUrl" in body) {
    updates.coverImage = resolveCoverImage(body.coverImage ?? body.coverImageUrl);
  }

  if (typeof body?.content === "string") {
    updates.readingTime = estimateReadingTime(body.content);
  }

  updates.updatedAt = new Date();

  const updated = await updatePortfolioItemById("blogs", id, updates, session.user.id);

  if (!updated) {
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { session, response } = await requireAdminApiSession();

  if (response || !session) {
    return response;
  }

  const deleted = await deletePortfolioItemById("blogs", id, session.user.id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: `Blog ${id} deleted successfully` });
}
