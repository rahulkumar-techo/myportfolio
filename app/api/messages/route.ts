import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"

export async function GET() {
  const { session, response } = await requireAdminApiSession()

  if (response || !session) {
    return response
  }

  const messages = (await listPortfolioItems("contactMessages", session.user.id))
    .filter((m: any) => !m.archived)
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  return NextResponse.json({
    success: true,
    data: messages,
    meta: {
      total: messages.length,
      unread: messages.filter((m: any) => !m.read).length
    }
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  const newMessage = {
    id: crypto.randomUUID(),
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    createdAt: new Date(),
    read: false,
    archived: false
  }

  await createPortfolioItem("contactMessages", newMessage)

  return NextResponse.json(
    {
      success: true,
      data: newMessage
    },
    { status: 201 }
  )
}
