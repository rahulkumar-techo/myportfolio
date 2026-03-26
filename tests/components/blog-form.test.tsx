import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { BlogForm, BlogFormState } from "@/app/admin/blogs/components/blog-form"

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt = "", ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
}))

const initialState: BlogFormState = {
  title: "",
  description: "",
  content: "",
  tags: "",
  coverImage: null,
  featured: false,
  publishedAt: ""
}

function TestBlogForm({
  onSubmit = jest.fn(),
  onCancel = jest.fn(),
  isSubmitting = false,
  isUploadingImage = false
}: {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
  isSubmitting?: boolean
  isUploadingImage?: boolean
}) {
  const [formData, setFormData] = useState<BlogFormState>(initialState)

  return (
    <BlogForm
      formData={formData}
      setFormData={setFormData}
      isSubmitting={isSubmitting}
      submitError={null}
      uploadError={null}
      isUploadingImage={isUploadingImage}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onCoverUpload={() => undefined}
      onRemoveCover={() => undefined}
    />
  )
}

describe("BlogForm", () => {
  it("renders core fields and action buttons", () => {
    render(<TestBlogForm />)

    expect(screen.getByLabelText("Title")).toBeInTheDocument()
    expect(screen.getByLabelText("Description")).toBeInTheDocument()
    expect(screen.getByLabelText("Tags (comma separated)")).toBeInTheDocument()
    expect(screen.getByLabelText("Cover Image")).toBeInTheDocument()
    expect(screen.getByLabelText("Markdown Content")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create Post" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument()
  })

  it("updates values and submits the form", () => {
    const handleSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())

    render(<TestBlogForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Next.js Microservices Guide" } })
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Short summary for SEO." } })
    fireEvent.change(screen.getByLabelText("Markdown Content"), { target: { value: "## Heading" } })

    expect(screen.getByLabelText("Title")).toHaveValue("Next.js Microservices Guide")
    expect(screen.getByLabelText("Description")).toHaveValue("Short summary for SEO.")
    expect(screen.getByLabelText("Markdown Content")).toHaveValue("## Heading")

    fireEvent.submit(screen.getByRole("button", { name: "Create Post" }).closest("form")!)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it("disables the submit button while saving and triggers reset", () => {
    const handleCancel = jest.fn()

    render(<TestBlogForm isSubmitting={true} onCancel={handleCancel} />)

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it("disables the cover input while uploading", () => {
    render(<TestBlogForm isUploadingImage={true} />)

    expect(screen.getByLabelText("Cover Image")).toBeDisabled()
  })
})
