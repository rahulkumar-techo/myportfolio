'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import type { CloudinaryImage, Project } from '@/lib/types'
import { ProjectForm, ProjectFormState } from '@/app/admin/projects/components/project-form'
import { ProjectsHeader } from '@/app/admin/projects/components/projects-header'
import { ProjectsList } from '@/app/admin/projects/components/projects-list'

const initialForm: ProjectFormState = {
  title: '',
  description: '',
  longDescription: '',
  category: '',
  techStack: '',
  coverImage: null,
  galleryImages: [],
  liveUrl: '',
  githubUrl: '',
  featured: false
}

export default function AdminProjectsPage() {
  const { projects, isLoading, error, createProject, updateProject, deleteProject } = useProjects()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [tempUploads, setTempUploads] = useState<string[]>([])

  const categories = useMemo<string[]>(
    () => ['All', ...Array.from(new Set(projects.map((project: Project) => project.category).filter(Boolean) as string[]))],
    [projects]
  )

  useEffect(() => {
    void fetch('/api/projects/cleanup-temp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ttlMs: 2 * 60 * 60 * 1000 })
    })
  }, [])


  useEffect(() => {
    const handleUnload = () => {
      if (tempUploads.length === 0) {
        return
      }

      const payload = JSON.stringify({ publicIds: tempUploads })
      navigator.sendBeacon('/api/projects/cleanup-temp', payload)
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [tempUploads])

  const filteredProjects = projects.filter((project: Project) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.longDescription || '').toLowerCase().includes(query)

    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const cleanupTempUploads = async () => {
    if (tempUploads.length === 0) {
      return
    }

    await Promise.allSettled(
      tempUploads.map((publicId) =>
        fetch('/api/projects/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId })
        })
      )
    )

    setTempUploads([])
  }

  const resetForm = async (options?: { cleanupTemp?: boolean }) => {
    if (options?.cleanupTemp) {
      await cleanupTempUploads()
    }
    setEditingProject(null)
    setFormData(initialForm)
    setSubmitError(null)
    setUploadError(null)
    setImageUrlInput('')
    setGalleryUrlInput('')
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setSubmitError(null)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      category: project.category,
      techStack: project.techStack.join(', '),
      coverImage: project.coverImage ?? null,
      galleryImages: project.galleryImages ?? [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured
    })
  }

  const uploadProjectImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/projects/upload', {
      method: 'POST',
      body: formData
    })

    const payload = await response.json()

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error ?? 'Upload failed.')
    }

    return payload.data as CloudinaryImage
  }

  const deleteProjectImage = async (publicId: string) => {
    await fetch('/api/projects/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    })
  }

  const extractCloudinaryPublicId = (url: string) => {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/)
    return match?.[1] ?? null
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return
    }

    setIsUploadingImage(true)
    setUploadError(null)

    try {
      const uploaded = await uploadProjectImage(file)
      if (formData.coverImage?.publicId && tempUploads.includes(formData.coverImage.publicId)) {
        await deleteProjectImage(formData.coverImage.publicId)
        setTempUploads((current) => current.filter((id) => id !== formData.coverImage?.publicId))
      }
      if (uploaded.publicId) {
        setTempUploads((current) => [...current, uploaded.publicId as string])
      }
      setFormData((current) => ({ ...current, coverImage: uploaded }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload image.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const remainingSlots = 5 - formData.galleryImages.length
    if (remainingSlots <= 0) {
      setUploadError('Gallery limit reached (max 5 images).')
      return
    }

    setIsUploadingGallery(true)
    setUploadError(null)

    try {
      const uploads = Array.from(files).slice(0, remainingSlots)
      const uploadedImages: CloudinaryImage[] = []

      for (const file of uploads) {
        const uploaded = await uploadProjectImage(file)
        if (uploaded.publicId) {
          setTempUploads((current) => [...current, uploaded.publicId as string])
        }
        uploadedImages.push(uploaded)
      }

      setFormData((current) => ({
        ...current,
        galleryImages: [...current.galleryImages, ...uploadedImages].slice(0, 5)
      }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload gallery images.')
    } finally {
      setIsUploadingGallery(false)
    }
  }

  const addImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) {
      return
    }
    if (!url.includes('res.cloudinary.com')) {
      setUploadError('Please use a Cloudinary image URL for the cover image.')
      return
    }
    const publicId = extractCloudinaryPublicId(url)
    setFormData((current) => ({ ...current, coverImage: { url, publicId: publicId ?? undefined } }))
    setImageUrlInput('')
  }

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim()
    if (!url) {
      return
    }
    if (!url.includes('res.cloudinary.com')) {
      setUploadError('Please use Cloudinary URLs for gallery images.')
      return
    }
    if (formData.galleryImages.length >= 5) {
      setUploadError('Gallery limit reached (max 5 images).')
      return
    }
    setFormData((current) => ({
      ...current,
      galleryImages: [...current.galleryImages, { url }].slice(0, 5)
    }))
    setGalleryUrlInput('')
  }

  const removeGalleryImage = async (index: number) => {
    const image = formData.galleryImages[index]
    if (image?.publicId && tempUploads.includes(image.publicId)) {
      await deleteProjectImage(image.publicId)
      setTempUploads((current) => current.filter((id) => id !== image.publicId))
    }
    setFormData((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, imageIndex) => imageIndex !== index)
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (formData.galleryImages.length > 5) {
        setSubmitError('Gallery images must be 5 or fewer.')
        return
      }
      if (!formData.coverImage?.url) {
        setSubmitError('Cover image is required.')
        return
      }

      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map((item) => item.trim()).filter(Boolean)
      }

      if (editingProject) {
        await updateProject(editingProject.id, payload)
      } else {
        await createProject(payload)
      }

      setTempUploads([])
      await resetForm()
    } catch {
      setSubmitError('Unable to save the project right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    setDeleteId(projectId)

    try {
      await deleteProject(projectId)

      if (editingProject?.id === projectId) {
        resetForm()
      }
    } finally {
      setDeleteId(null)
    }
  }

  const toggleFeatured = async (project: Project) => {
    await updateProject(project.id, { featured: !project.featured })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load projects.</p>
  }

  return (
    <div className="flex h-full min-h-0 flex-col space-y-6 overflow-hidden">
      <ProjectsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="grid flex-1 min-h-0 gap-6 overflow-hidden xl:grid-cols-[420px_minmax(0,1fr)]">
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          editingProject={editingProject}
          isSubmitting={isSubmitting}
          submitError={submitError}
          uploadError={uploadError}
          isUploadingImage={isUploadingImage}
          isUploadingGallery={isUploadingGallery}
          imageUrlInput={imageUrlInput}
          setImageUrlInput={setImageUrlInput}
          galleryUrlInput={galleryUrlInput}
          setGalleryUrlInput={setGalleryUrlInput}
          onSubmit={handleSubmit}
          onCancel={() => void resetForm({ cleanupTemp: true })}
          onCoverUpload={handleImageUpload}
          onGalleryUpload={handleGalleryUpload}
          onAddCoverUrl={addImageUrl}
          onAddGalleryUrl={addGalleryUrl}
          onRemoveCover={async () => {
            if (formData.coverImage?.publicId && tempUploads.includes(formData.coverImage.publicId)) {
              await deleteProjectImage(formData.coverImage.publicId)
              setTempUploads((current) => current.filter((id) => id !== formData.coverImage?.publicId))
            }
            setFormData((current) => ({ ...current, coverImage: null }))
          }}
          onRemoveGallery={(index) => void removeGalleryImage(index)}
        />

        <div className="min-h-0 overflow-y-auto admin-scroll">
          <ProjectsList
            projects={filteredProjects}
            onToggleFeatured={(project) => void toggleFeatured(project)}
            onEdit={startEdit}
            onDelete={(projectId) => void handleDelete(projectId)}
            deleteId={deleteId}
          />
        </div>
      </div>
    </div>
  )
}
