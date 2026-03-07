'use client'

import { useState } from 'react'
import { Briefcase, Calendar, Loader2, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useExperience } from '@/hooks/useExperience'
import type { Experience } from '@/lib/types'

type ExperienceFormState = {
  title: string
  company: string
  companyUrl: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string
  technologies: string
}

const initialForm: ExperienceFormState = {
  title: '',
  company: '',
  companyUrl: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: '',
  technologies: ''
}

export default function AdminExperiencePage() {
  const { experiences, isLoading, error, createExperience, updateExperience, deleteExperience } = useExperience()
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState<ExperienceFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const resetForm = () => {
    setEditingExperience(null)
    setFormData(initialForm)
    setSubmitError(null)
  }

  const startEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setSubmitError(null)
    setFormData({
      title: experience.title,
      company: experience.company,
      companyUrl: experience.companyUrl || '',
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate || '',
      current: experience.current,
      description: experience.description,
      achievements: experience.achievements.join('\n'),
      technologies: experience.technologies.join(', ')
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        ...formData,
        endDate: formData.current ? '' : formData.endDate,
        achievements: formData.achievements.split('\n').map((item) => item.trim()).filter(Boolean),
        technologies: formData.technologies.split(',').map((item) => item.trim()).filter(Boolean)
      }

      if (editingExperience) {
        await updateExperience(editingExperience.id, payload)
      } else {
        await createExperience(payload)
      }

      resetForm()
    } catch {
      setSubmitError('Unable to save the experience right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (experienceId: string) => {
    setDeleteId(experienceId)

    try {
      await deleteExperience(experienceId)

      if (editingExperience?.id === experienceId) {
        resetForm()
      }
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load experience.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Experience</h1>
        <p className="text-muted-foreground">Maintain your work history, achievements, and stack by role.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {editingExperience ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <p className="text-sm text-muted-foreground">Use one line per achievement and commas for technologies.</p>
            </div>

            {editingExperience ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-title">Role</Label>
              <Input
                id="experience-title"
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-company">Company</Label>
              <Input
                id="experience-company"
                value={formData.company}
                onChange={(event) => setFormData((current) => ({ ...current, company: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-company-url">Company URL</Label>
              <Input
                id="experience-company-url"
                value={formData.companyUrl}
                onChange={(event) => setFormData((current) => ({ ...current, companyUrl: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-location">Location</Label>
              <Input
                id="experience-location"
                value={formData.location}
                onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-start-date">Start Date</Label>
              <Input
                id="experience-start-date"
                type="date"
                value={formData.startDate}
                onChange={(event) => setFormData((current) => ({ ...current, startDate: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-end-date">End Date</Label>
              <Input
                id="experience-end-date"
                type="date"
                disabled={formData.current}
                value={formData.endDate}
                onChange={(event) => setFormData((current) => ({ ...current, endDate: event.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
            <Checkbox
              id="experience-current"
              checked={formData.current}
              onCheckedChange={(checked) =>
                setFormData((current) => ({ ...current, current: Boolean(checked), endDate: Boolean(checked) ? '' : current.endDate }))
              }
            />
            <Label htmlFor="experience-current">This is my current role</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-description">Description</Label>
            <Textarea
              id="experience-description"
              value={formData.description}
              onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-achievements">Achievements</Label>
            <Textarea
              id="experience-achievements"
              value={formData.achievements}
              onChange={(event) => setFormData((current) => ({ ...current, achievements: event.target.value }))}
              rows={5}
              placeholder="One achievement per line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-technologies">Technologies</Label>
            <Input
              id="experience-technologies"
              value={formData.technologies}
              onChange={(event) => setFormData((current) => ({ ...current, technologies: event.target.value }))}
              placeholder="React, TypeScript, AWS"
            />
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingExperience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </form>

        <div className="space-y-4">
          {experiences.map((experience: Experience) => (
            <div key={experience.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{experience.title}</h3>
                    {experience.current ? (
                      <span className="rounded-full bg-primary/15 px-2 py-1 text-xs text-primary">Current</span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {experience.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate || experience.startDate)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{experience.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => startEdit(experience)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={deleteId === experience.id}
                    onClick={() => void handleDelete(experience.id)}
                  >
                    {deleteId === experience.id ? (
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
