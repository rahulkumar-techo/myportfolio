import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/auth";
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository";
import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers";
import { findNonAdminUsers } from "@/repositories/user-repository";
import { slugify } from "@/utils/slugify";

export async function GET() {
  const projects = await listPortfolioItems("projects")

  return NextResponse.json({
    success: true,
    data: projects,
    meta: {
      total: projects.length,
      timestamp: new Date().toISOString()
    }
  })
}

export async function POST(request: Request) {
  try {
    const { session, response } = await requireAdminApiSession()

    if (response || !session) {
      return response
    }

    const body = await request.json()

    const requiredFields = ["title", "description", "category"]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const newProject = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      slug: body.slug || slugify(body.title || ""),
      longDescription: body.longDescription || "",
      techStack: body.techStack || [],
      imageUrl: body.imageUrl || "",
      galleryImages: body.galleryImages || [],
      liveUrl: body.liveUrl || "",
      githubUrl: body.githubUrl || "",
      featured: body.featured || false,
      category: body.category,
      createdAt: new Date()
    }


    const startMs = Date.now();
    const savedProject = await createPortfolioItem("projects", newProject, session.user.id);
    const createMs = Date.now() - startMs;
    console.log("createPortfolioItem ms:", createMs);

    // send email notification to non-admin users
    if (savedProject) {
      const users = await findNonAdminUsers();
      await sendEmailsToUsers(users, newProject);
    }

    return NextResponse.json(
      { success: true, data: newProject },
      { status: 201 }
    )

  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
