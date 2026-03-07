/**
 * @jest-environment node
 */

import { NextResponse } from "next/server"
import { GET, POST } from "@/app/api/messages/route"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"
import { requireAdminApiSession } from "@/lib/auth"

jest.mock("@/repositories/portfolio-repository", () => ({
  createPortfolioItem: jest.fn(),
  listPortfolioItems: jest.fn()
}))

jest.mock("@/lib/auth", () => ({
  requireAdminApiSession: jest.fn()
}))

const mockedCreatePortfolioItem = jest.mocked(createPortfolioItem)
const mockedListPortfolioItems = jest.mocked(listPortfolioItems)
const mockedRequireAdminApiSession = jest.mocked(requireAdminApiSession)

describe("/api/messages route", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns non-archived messages ordered by newest first", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any)

    mockedListPortfolioItems.mockResolvedValue([
      { id: "old", subject: "Older", archived: false, read: true, createdAt: "2024-01-01T00:00:00.000Z" },
      { id: "new", subject: "Newest", archived: false, read: false, createdAt: "2024-05-01T00:00:00.000Z" },
      { id: "archived", subject: "Archived", archived: true, read: false, createdAt: "2024-06-01T00:00:00.000Z" }
    ] as any)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.meta.total).toBe(2)
    expect(body.meta.unread).toBe(1)
    expect(body.data.map((message: { id: string }) => message.id)).toEqual(["new", "old"])
  })

  it("blocks GET requests when the user is unauthorized", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    } as any)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe("Unauthorized")
  })

  it("creates a public message through POST", async () => {
    const request = new Request("http://localhost/api/messages", {
      method: "POST",
      body: JSON.stringify({
        name: "Visitor",
        email: "visitor@example.com",
        subject: "Need help",
        message: "Can we collaborate?"
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.email).toBe("visitor@example.com")
    expect(mockedCreatePortfolioItem).toHaveBeenCalledWith(
      "contactMessages",
      expect.objectContaining({
        subject: "Need help",
        archived: false,
        read: false
      })
    )
  })
})
