'use client'

import { useState } from 'react'
import { Code, Globe, Loader2, Pencil, Plus, Server, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useSkills } from '@/hooks/useSkills'
import type { Skill } from '@/lib/types'

const categoryIcons = {
  frontend: Globe,
  backend: Server,
  devops: Settings,
  languages: Code,
  tools: Settings
}

const categoryOptions = ['frontend', 'backend', 'devops', 'languages', 'tools'] as const

type SkillFormState = {
  name: string
  category: Skill['category']
  proficiency: number
  icon: string
}

const initialForm: SkillFormState = {
  name: '',
  category: 'frontend',
  proficiency: 50,
  icon: ''
}

export default function AdminSkillsPage() {
  const { skills, isLoading, error, createSkill, updateSkill, deleteSkill } = useSkills()
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState<SkillFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }

    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const resetForm = () => {
    setEditingSkill(null)
    setFormData(initialForm)
    setSubmitError(null)
  }

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setSubmitError(null)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || ''
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData)
      } else {
        await createSkill(formData)
      }

      resetForm()
    } catch {
      setSubmitError('Unable to save the skill right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (skillId: string) => {
    setDeleteId(skillId)

    try {
      await deleteSkill(skillId)

      if (editingSkill?.id === skillId) {
        resetForm()
      }
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load skills.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skills</h1>
        <p className="text-muted-foreground">Manage your stack, categories, and proficiency levels.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
              <p className="text-sm text-muted-foreground">Keep your skills list accurate and visible.</p>
            </div>

            {editingSkill ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: Skill['category']) => setFormData((current) => ({ ...current, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Proficiency</Label>
              <span className="text-sm text-muted-foreground">{formData.proficiency}%</span>
            </div>

            <Slider
              value={[formData.proficiency]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setFormData((current) => ({ ...current, proficiency: value[0] ?? 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-icon">Icon</Label>
            <Input
              id="skill-icon"
              value={formData.icon}
              onChange={(event) => setFormData((current) => ({ ...current, icon: event.target.value }))}
              placeholder="react, nodejs, docker"
            />
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingSkill ? 'Update Skill' : 'Create Skill'}
          </Button>
        </form>

        <div className="space-y-4">
          {(Object.entries(groupedSkills) as [string, Skill[]][]).map(([category, items]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] || Code

            return (
              <div key={category} className="glass-card rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold capitalize text-foreground">{category}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((skill: Skill) => (
                    <div key={skill.id} className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">Icon: {skill.icon || 'none'}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(skill)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={deleteId === skill.id}
                            onClick={() => void handleDelete(skill.id)}
                          >
                            {deleteId === skill.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
