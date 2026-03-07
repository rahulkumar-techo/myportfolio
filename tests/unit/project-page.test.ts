import { generateMetadata, generateStaticParams } from "@/app/projects/[id]/page"

jest.mock("@/lib/data", () => ({
  projects: [
    {
      id: "alpha",
      title: "Alpha Project",
      description: "Alpha description"
    },
    {
      id: "beta",
      title: "Beta Project",
      description: "Beta description"
    }
  ]
}))

describe("project page helpers", () => {
  it("returns all static params for pre-rendering project pages", async () => {
    const params = await generateStaticParams()

    expect(params).toEqual([
      { id: "alpha" },
      { id: "beta" }
    ])
  })

  it("builds metadata for a known project id", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "alpha" })
    })

    expect(metadata).toEqual({
      title: "Alpha Project | Portfolio",
      description: "Alpha description"
    })
  })

  it("returns a fallback title when the project does not exist", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "missing-project" })
    })

    expect(metadata).toEqual({
      title: "Project Not Found"
    })
  })
})
