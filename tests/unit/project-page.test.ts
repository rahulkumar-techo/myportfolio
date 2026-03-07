jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: (key: string) => {
      if (key === "host") {
        return "localhost:3000"
      }

      return null
    }
  })
}))

jest.mock("@/app/projects/[id]/project-detail-client", () => ({
  __esModule: true,
  default: () => null
}))

import { generateMetadata } from "@/app/projects/[id]/page"

describe("project page helpers", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it("builds metadata for a known project id", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "alpha",
          title: "Alpha Project",
          description: "Alpha description",
          techStack: [],
          featured: false,
          category: "Web",
          createdAt: "2026-03-07T00:00:00.000Z"
        }
      })
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "alpha" })
    })

    expect(metadata).toEqual({
      title: "Alpha Project | Portfolio",
      description: "Alpha description"
    })
  })

  it("returns a fallback title when the project does not exist", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "missing-project" })
    })

    expect(metadata).toEqual({
      title: "Project Not Found | Portfolio"
    })
  })
})
