'use client'

import { useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Quote, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTestimonials } from '@/hooks/useTestimonials'
import type { Testimonial } from '@/lib/types'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

type TestimonialFormState = {
  name: string
  role: string
  company: string
  content: string
  avatarUrl: string
  rating: string
}

const initialForm: TestimonialFormState = {
  name: '',
  role: '',
  company: '',
  content: '',
  avatarUrl: '',
  rating: '5'
}

export default function AdminTestimonialsPage() {
  const { testimonials, isLoading, error, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState<TestimonialFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const testimonialsPerPage = 5
  const totalPages = Math.max(1, Math.ceil(testimonials.length / testimonialsPerPage))
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * testimonialsPerPage,
    currentPage * testimonialsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const resetForm = () => {
    setEditingTestimonial(null)
    setFormData(initialForm)
    setSubmitError(null)
  }

  const startEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setSubmitError(null)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      avatarUrl: testimonial.avatarUrl || '',
      rating: String(testimonial.rating)
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating)
      }

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, payload)
      } else {
        await createTestimonial(payload)
      }

      resetForm()
    } catch {
      setSubmitError('Unable to save the testimonial right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (testimonialId: string) => {
    setDeleteId(testimonialId)

    try {
      await deleteTestimonial(testimonialId)

      if (editingTestimonial?.id === testimonialId) {
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
    return <p className="text-destructive">Failed to load testimonials.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <p className="text-muted-foreground">Publish client and colleague feedback with ratings.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <p className="text-sm text-muted-foreground">Capture a quote, role, company, and rating.</p>
            </div>

            {editingTestimonial ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Name</Label>
              <Input
                id="testimonial-name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial-role">Role</Label>
              <Input
                id="testimonial-role"
                value={formData.role}
                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testimonial-company">Company</Label>
              <Input
                id="testimonial-company"
                value={formData.company}
                onChange={(event) => setFormData((current) => ({ ...current, company: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial-rating">Rating</Label>
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={(event) => setFormData((current) => ({ ...current, rating: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial-avatar">Avatar URL</Label>
            <Input
              id="testimonial-avatar"
              value={formData.avatarUrl}
              onChange={(event) => setFormData((current) => ({ ...current, avatarUrl: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial-content">Quote</Label>
            <Textarea
              id="testimonial-content"
              value={formData.content}
              onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
              rows={6}
              required
            />
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
          </Button>
        </form>

        <div className="space-y-4">
          {paginatedTestimonials.map((testimonial: Testimonial) => (
            <div key={testimonial.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Quote className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">{testimonial.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{testimonial.content}</p>

                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={`${testimonial.id}-${index}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => startEdit(testimonial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={deleteId === testimonial.id}
                    onClick={() => void handleDelete(testimonial.id)}
                  >
                    {deleteId === testimonial.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </div>
  )
}
