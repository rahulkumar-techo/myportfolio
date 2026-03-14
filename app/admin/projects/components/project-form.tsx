'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import Image from 'next/image'
import { Loader2, Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildCloudinaryImageUrl } from '@/lib/cloudinary-images'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CloudinaryImage, Project } from '@/lib/types'

export type ProjectFormState = {
  title: string
  description: string
  longDescription: string
  category: string
  techStack: string
  coverImage: CloudinaryImage | null
  galleryImages: CloudinaryImage[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

type ProjectFormProps = {
  formData: ProjectFormState
  setFormData: Dispatch<SetStateAction<ProjectFormState>>
  editingProject: Project | null
  isSubmitting: boolean
  submitError: string | null
  uploadError: string | null
  isUploadingImage: boolean
  isUploadingGallery: boolean
  imageUrlInput: string
  setImageUrlInput: (value: string) => void
  galleryUrlInput: string
  setGalleryUrlInput: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onCancel: () => void
  onCoverUpload: (file: File | null) => void
  onGalleryUpload: (files: FileList | null) => void
  onAddCoverUrl: () => void
  onAddGalleryUrl: () => void
  onRemoveCover: () => void | Promise<void>
  onRemoveGallery: (index: number) => void | Promise<void>
}

export function ProjectForm({
  formData,
  setFormData,
  editingProject,
  isSubmitting,
  submitError,
  uploadError,
  isUploadingImage,
  isUploadingGallery,
  imageUrlInput,
  setImageUrlInput,
  galleryUrlInput,
  setGalleryUrlInput,
  onSubmit,
  onCancel,
  onCoverUpload,
  onGalleryUpload,
  onAddCoverUrl,
  onAddGalleryUrl,
  onRemoveCover,
  onRemoveGallery
}: ProjectFormProps) {
  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {editingProject ? 'Edit Project' : 'Add Project'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {editingProject ? 'Update the selected project.' : 'Create a new portfolio project.'}
          </p>
        </div>

        {editingProject ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-title">Title *</Label>
        <Input
          id="project-title"
          value={formData.title}
          onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Short Description *</Label>
        <Textarea
          id="project-description"
          value={formData.description}
          onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-long-description">Long Description</Label>
        <Textarea
          id="project-long-description"
          value={formData.longDescription}
          onChange={(event) => setFormData((current) => ({ ...current, longDescription: event.target.value }))}
          rows={5}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-category">Category *</Label>
          <Input
            id="project-category"
            value={formData.category}
            onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-tech-stack">Tech Stack</Label>
          <Input
            id="project-tech-stack"
            value={formData.techStack}
            onChange={(event) => setFormData((current) => ({ ...current, techStack: event.target.value }))}
            placeholder="Next.js, MongoDB, Three.js"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Cover Image (Cloudinary) *</Label>
          {formData.coverImage ? (
            <Button type="button" variant="ghost" size="sm" onClick={onRemoveCover}>
              Remove
            </Button>
          ) : null}
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
          {formData.coverImage?.url ? (
            <div className="relative h-40 w-full overflow-hidden rounded-md">
              <Image
              src={buildCloudinaryImageUrl(formData.coverImage.url, 'hero')}
              alt={formData.title || 'Cover image'}
              fill
              unoptimized
              sizes="420px"
              className="object-cover"
            />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
              No cover image uploaded yet.
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => onCoverUpload(event.target.files?.[0] ?? null)}
            disabled={isUploadingImage}
          />
          <div className="flex flex-wrap gap-2">
            <Input
              value={imageUrlInput}
              onChange={(event) => setImageUrlInput(event.target.value)}
              placeholder="Or paste a Cloudinary image URL"
            />
            <Button type="button" variant="outline" onClick={onAddCoverUrl} disabled={!imageUrlInput.trim()}>
              <Upload className="mr-2 h-4 w-4" />
              Set URL
            </Button>
          </div>
          {isUploadingImage ? (
            <p className="text-xs text-muted-foreground">Uploading image...</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-live-url">Live URL</Label>
        <Input
          id="project-live-url"
          value={formData.liveUrl}
          onChange={(event) => setFormData((current) => ({ ...current, liveUrl: event.target.value }))}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Gallery Images</Label>
          <span className="text-xs text-muted-foreground">
            {formData.galleryImages.length}/5
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {formData.galleryImages.map((image, index) => (
            <div key={`${image.url}-${index}`} className="relative overflow-hidden rounded-lg border border-border/60">
              <Image
                src={buildCloudinaryImageUrl(image.url, 'gallery')}
                alt={`Gallery image ${index + 1}`}
                width={320}
                height={128}
                unoptimized
                sizes="(max-width: 640px) 100vw, 160px"
                className="h-32 w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => onRemoveGallery(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {formData.galleryImages.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
              No gallery images yet.
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onGalleryUpload(event.target.files)}
            disabled={isUploadingGallery}
          />
          <div className="flex flex-wrap gap-2">
            <Input
              value={galleryUrlInput}
              onChange={(event) => setGalleryUrlInput(event.target.value)}
              placeholder="Paste a gallery image URL"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddGalleryUrl}
              disabled={!galleryUrlInput.trim() || formData.galleryImages.length >= 5}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add URL
            </Button>
          </div>
          {isUploadingGallery ? (
            <p className="text-xs text-muted-foreground">Uploading gallery images...</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-github-url">GitHub URL</Label>
        <Input
          id="project-github-url"
          value={formData.githubUrl}
          onChange={(event) => setFormData((current) => ({ ...current, githubUrl: event.target.value }))}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Featured project</p>
          <p className="text-xs text-muted-foreground">Show this project in featured sections.</p>
        </div>

        <Switch
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData((current) => ({ ...current, featured: Boolean(checked) }))}
        />
      </div>

      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}
      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {editingProject ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  )
}
