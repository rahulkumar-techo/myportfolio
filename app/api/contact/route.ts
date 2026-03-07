import { NextResponse } from "next/server"
import { requireVerifiedGoogleUserSession } from "@/lib/auth"
import { createPortfolioItem } from "@/repositories/portfolio-repository"
import { listPortfolioItems } from "@/repositories/portfolio-repository"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: Request) {
  try {
    const { session, response } = await requireVerifiedGoogleUserSession()

    if (response || !session) {
      return response
    }

    const body: ContactFormData = await request.json()

    /* ================= VALIDATION ================= */

    const requiredFields: (keyof ContactFormData)[] = [
      "name",
      "email",
      "subject",
      "message"
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const existingMessages = await listPortfolioItems("contactMessages")
    const alreadySent = existingMessages.some(
      (message: any) => message.email?.toLowerCase() === session.user.email?.toLowerCase()
    )

    if (alreadySent) {
      return NextResponse.json(
        { success: false, error: "You have already sent a message." },
        { status: 409 }
      )
    }

    const newMessage = {
      id: crypto.randomUUID(),
      name: session.user.name || body.name,
      email: session.user.email,
      subject: body.subject,
      message: body.message,
      createdAt: new Date(),
      read: false,
      archived: false
    }

    await createPortfolioItem("contactMessages", newMessage)

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      message: "Message received successfully! I will get back to you soon.",
      data: {
        id: newMessage.id,
        receivedAt: newMessage.createdAt
      }
    })

  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
