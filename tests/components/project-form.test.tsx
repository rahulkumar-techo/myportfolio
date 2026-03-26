import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import type { ProjectFormState } from "@/app/admin/projects/components/project-form"
import { ProjectForm } from "@/app/admin/projects/components/project-form"
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt = "", ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
}))

const initialState: ProjectFormState = {
  title: "",
  description: "",
  longDescription: "",
  problem: "",
  solution: "",
  architecture: "",
  results: "",
  category: "",
  techStack: "",
  coverImage: null,
  galleryImages: [],
  liveUrl: "",
  githubUrl: "",
  featured: false
}

function TestProjectForm({
  onSubmit = jest.fn(),
  isSubmitting = false
}: {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
}) {
  const [formData, setFormData] = useState<ProjectFormState>(initialState)

  return (
    <ProjectForm
      formData={formData}
      setFormData={setFormData}
      editingProject={null}
      isSubmitting={isSubmitting}
      submitError={null}
      uploadError={null}
      isUploadingImage={false}
      isUploadingGallery={false}
      imageUrlInput=""
      setImageUrlInput={() => undefined}
      galleryUrlInput=""
      setGalleryUrlInput={() => undefined}
      onSubmit={onSubmit}
      onCancel={() => undefined}
      onCoverUpload={() => undefined}
      onGalleryUpload={() => undefined}
      onAddCoverUrl={() => undefined}
      onAddGalleryUrl={() => undefined}
      onRemoveCover={() => undefined}
      onRemoveGallery={() => undefined}
    />
  )
}

describe("ProjectForm", () => {
  it("renders the case study fields", () => {
    render(<TestProjectForm />)

    expect(screen.getByLabelText("Problem")).toBeInTheDocument()
    expect(screen.getByLabelText("Solution")).toBeInTheDocument()
    expect(screen.getByLabelText("Architecture")).toBeInTheDocument()
    expect(screen.getByLabelText("Results")).toBeInTheDocument()
  })

  it("updates case study values and submits", () => {
    const handleSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())

    render(<TestProjectForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText("Problem"), { target: { value: "Legacy workflow delays" } })
    fireEvent.change(screen.getByLabelText("Solution"), { target: { value: "Automated pipeline" } })
    fireEvent.change(screen.getByLabelText("Architecture"), { target: { value: "Event-driven services" } })
    fireEvent.change(screen.getByLabelText("Results"), { target: { value: "35% faster releases" } })

    expect(screen.getByLabelText("Problem")).toHaveValue("Legacy workflow delays")
    expect(screen.getByLabelText("Solution")).toHaveValue("Automated pipeline")
    expect(screen.getByLabelText("Architecture")).toHaveValue("Event-driven services")
    expect(screen.getByLabelText("Results")).toHaveValue("35% faster releases")

    fireEvent.submit(screen.getByRole("button", { name: "Create Project" }).closest("form")!)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it("disables submit button while submitting", () => {
    render(<TestProjectForm isSubmitting={true} />)

    expect(screen.getByRole("button", { name: "Create Project" })).toBeDisabled()
  })
})
