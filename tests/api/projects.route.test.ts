/**
 * @jest-environment node
 */

import { NextResponse } from "next/server"
import { GET, POST } from "@/app/api/projects/route"
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository"
import { requireAdminApiSession } from "@/lib/auth"
import { findNonAdminUsers } from "@/repositories/user-repository"
import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers"

jest.mock("@/repositories/portfolio-repository", () => ({
  createPortfolioItem: jest.fn(),
  listPortfolioItems: jest.fn()
}))

jest.mock("@/lib/auth", () => ({
  requireAdminApiSession: jest.fn()
}))

jest.mock("@/repositories/user-repository", () => ({
  findNonAdminUsers: jest.fn()
}))

jest.mock("@/utils/sendEmailsToUsers", () => ({
  sendEmailsToUsers: jest.fn()
}))

const mockedCreatePortfolioItem = jest.mocked(createPortfolioItem)
const mockedListPortfolioItems = jest.mocked(listPortfolioItems)
const mockedRequireAdminApiSession = jest.mocked(requireAdminApiSession)
const mockedFindNonAdminUsers = jest.mocked(findNonAdminUsers)
const mockedSendEmailsToUsers = jest.mocked(sendEmailsToUsers)

describe("/api/projects route", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns all projects for GET requests", async () => {
    mockedListPortfolioItems.mockResolvedValue([
      { id: "one", title: "Project One" },
      { id: "two", title: "Project Two" }
    ] as any)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.meta.total).toBe(2)
    expect(body.data[0].title).toBe("Project One")
    expect(mockedListPortfolioItems).toHaveBeenCalledWith("projects")
  })

  it("rejects POST requests when the admin session is missing", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    } as any)

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: "Blocked project",
        description: "No auth",
        category: "Web"
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe("Unauthorized")
  })

  it("returns a 400 response when required fields are missing", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any)

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: "Incomplete project"
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.error).toContain("description")
    expect(mockedCreatePortfolioItem).not.toHaveBeenCalled()
  })

  it("creates a project for a valid authenticated POST request", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any)

    mockedCreatePortfolioItem.mockResolvedValue({
      id: "p1",
      title: "Portfolio",
      description: "A personal site",
      category: "Web"
    } as any)
    mockedFindNonAdminUsers.mockResolvedValue([{ name: "User", email: "u@example.com" }] as any)
    mockedSendEmailsToUsers.mockResolvedValue(undefined as any)

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: "Portfolio",
        description: "A personal site",
        category: "Web",
        techStack: ["Next.js", "MongoDB"]
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.title).toBe("Portfolio")
    expect(mockedCreatePortfolioItem).toHaveBeenCalledWith(
      "projects",
      expect.objectContaining({
        title: "Portfolio",
        category: "Web"
      }),
      "admin-1"
    )
    expect(mockedFindNonAdminUsers).toHaveBeenCalled()
    expect(mockedSendEmailsToUsers).toHaveBeenCalledWith(
      [{ name: "User", email: "u@example.com" }],
      expect.objectContaining({ title: "Portfolio" })
    )
  })

  it("returns 400 for malformed JSON request bodies", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any)

    const request = {
      json: jest.fn().mockRejectedValue(new Error("Unexpected token"))
    } as unknown as Request

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe("Invalid request body")
  })
})
