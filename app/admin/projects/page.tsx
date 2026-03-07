'use client'

import { useMemo, useState } from 'react'
import { Edit, ExternalLink, Github, Loader2, Plus, Star, StarOff, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/lib/types'

type ProjectFormState = {
  title: string
  description: string
  longDescription: string
  category: string
  techStack: string
  imageUrl: string
  liveUrl: string
  githubUrl: string
  featured: boolean
}

const initialForm: ProjectFormState = {
  title: '',
  description: '',
  longDescription: '',
  category: '',
  techStack: '',
  imageUrl: '',
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

  const categories = useMemo<string[]>(
    () => ['All', ...Array.from(new Set(projects.map((project: Project) => project.category).filter(Boolean) as string[]))],
    [projects]
  )

  const filteredProjects = projects.filter((project: Project) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.longDescription || '').toLowerCase().includes(query)

    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const resetForm = () => {
    setEditingProject(null)
    setFormData(initialForm)
    setSubmitError(null)
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
      imageUrl: project.imageUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map((item) => item.trim()).filter(Boolean)
      }

      if (editingProject) {
        await updateProject(editingProject.id, payload)
      } else {
        await createProject(payload)
      }

      resetForm()
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Create, edit, feature, and remove portfolio projects.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search projects"
            className="sm:w-64"
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>  
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
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
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              value={formData.title}
              onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Short Description</Label>
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
              <Label htmlFor="project-category">Category</Label>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-image-url">Image URL</Label>
              <Input
                id="project-image-url"
                value={formData.imageUrl}
                onChange={(event) => setFormData((current) => ({ ...current, imageUrl: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-live-url">Live URL</Label>
              <Input
                id="project-live-url"
                value={formData.liveUrl}
                onChange={(event) => setFormData((current) => ({ ...current, liveUrl: event.target.value }))}
              />
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

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </form>

        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-sm text-muted-foreground">
              No projects match the current filter.
            </div>
          ) : null}

          {filteredProjects.map((project: Project) => (
            <div key={project.id} className="glass-card rounded-2xl p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                      {project.category}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full bg-primary/15 px-2 py-1 text-xs text-primary">Featured</span>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                        Live
                      </a>
                    ) : null}

                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => void toggleFeatured(project)}>
                    {project.featured ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => startEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={deleteId === project.id}
                    onClick={() => void handleDelete(project.id)}
                  >
                    {deleteId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
