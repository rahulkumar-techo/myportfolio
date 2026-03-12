import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { createPortfolioItem, getPortfolioOwner, listPortfolioItems } from "@/repositories/portfolio-repository"
import { findUsers } from "@/repositories/user-repository"
import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers"

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


    const getUsers = await findUsers();

    console.log({ getUsers });

    // remove admin
    const users = getUsers?.filter((user) => user.admin !== "admin");

    const project = await createPortfolioItem("projects", newProject, session.user.id);
    // Send notifications (async)
    if (users?.length && project) {
      await sendEmailsToUsers(users, project);
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
