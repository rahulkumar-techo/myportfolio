'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Star, Quote, Loader2, Send, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useTestimonials } from '@/hooks/useTestimonials';
import type { Testimonial } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -8, rotateY: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-card rounded-2xl p-6 h-full relative overflow-hidden hover:border-primary/30 transition-all"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Holographic Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Quote Icon */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="w-16 h-16 text-primary" />
        </div>

        <div className="relative z-10">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating 
                    ? 'fill-yellow-500 text-yellow-500' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <p className="text-muted-foreground leading-relaxed mb-6 italic">
            &quot;{testimonial.content}&quot;
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {testimonial.avatarUrl && !imageFailed ? (
                <Image
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">
                {testimonial.role} at{' '}
                <span className="text-primary">{testimonial.company}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { testimonials, isLoading, createTestimonial } = useTestimonials();
  const featuredTestimonials = testimonials.filter((testimonial: Testimonial) => testimonial.featured);
  const { user, loginWithGoogle, logout } = useAuth();
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    content: '',
    rating: 5
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const testimonialsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(featuredTestimonials.length / testimonialsPerPage));
  const paginatedTestimonials = featuredTestimonials.slice(
    (currentPage - 1) * testimonialsPerPage,
    currentPage * testimonialsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  const hasSubmittedAlready = useMemo(
    () =>
      Boolean(
        user?.email &&
          testimonials.some(
            (testimonial: Testimonial) =>
              testimonial.submittedByEmail?.toLowerCase() === user.email?.toLowerCase()
          )
      ),
    [testimonials, user?.email]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (user?.provider !== 'google') {
      setSubmitError('Please sign in with Google to send a testimonial.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await createTestimonial(formData);
      setSubmitted(true);
      setFormData({
        role: '',
        company: '',
        content: '',
        rating: 5
      });
    } catch (error: any) {
      setSubmitError(error?.response?.data?.error || 'Unable to submit your testimonial right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
            <MessageSquare className="w-4 h-4" />
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">What People </span>
            <span className="text-primary text-glow-cyan">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from colleagues and clients I have had the pleasure of working with
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : featuredTestimonials.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl p-10 text-center glass-card">
            <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-lg font-medium text-foreground">No featured testimonials yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Mark testimonials as featured from the admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" style={{ perspective: '1000px' }}>
            {paginatedTestimonials.map((testimonial: Testimonial, index: number) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={(currentPage - 1) * testimonialsPerPage + index}
              />
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 ? (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#testimonials"
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#testimonials"
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#testimonials"
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-3xl mx-auto mt-14"
        >
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-semibold text-foreground">Leave a Testimonial</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Worked with me before? Sign in with Google and share one quick note for future clients and collaborators.
              </p>
            </div>

            {submitted || hasSubmittedAlready ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                </div>
                <p className="text-lg font-medium text-foreground">
                  {submitted ? 'Thanks for the testimonial.' : 'Testimonial already submitted.'}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {submitted
                    ? 'Your feedback has been added successfully.'
                    : 'You have already shared your feedback with this account.'}
                </p>
              </div>
            ) : user?.provider !== 'google' ? (
              <div className="space-y-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Only signed-in Google users can send testimonial feedback, and each user can submit one testimonial.
                </p>
                <Button type="button" onClick={() => void loginWithGoogle('/#testimonials')} className="w-full">
                  Sign in with Google
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Signed in as <span className="text-foreground">{user?.name || user?.email}</span>
                    </span>
                    <Button type="button" variant="outline" size="sm" onClick={() => void logout('/#testimonials')}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-role">Role</Label>
                    <Input
                      id="testimonial-role"
                      placeholder="eg: Full Stack Developer, Teacher, Product Manager"
                      className="border-border bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary"
                      value={formData.role}
                      onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-company">Company</Label>
                    <Input
                      id="testimonial-company"
                      placeholder="eg: School, Startup, Agency, Freelance Team"
                      className="border-border bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary"
                      value={formData.company}
                      onChange={(event) => setFormData((current) => ({ ...current, company: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-rating">Rating</Label>
                    <Select
                      value={String(formData.rating)}
                      onValueChange={(value) =>
                        setFormData((current) => ({ ...current, rating: Number(value) }))
                      }
                    >
                      <SelectTrigger
                        id="testimonial-rating"
                        className="border-border bg-secondary/50 text-foreground focus:border-primary"
                      >
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, index) => {
                          const rating = String(index + 1);
                          return (
                            <SelectItem key={rating} value={rating}>
                              {rating} Star{rating === '1' ? '' : 's'}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial-content">Testimonial</Label>
                  <Textarea
                    id="testimonial-content"
                    placeholder="eg: Clear communication, strong execution, and delivered on time."
                    className="resize-none border-border bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary"
                    value={formData.content}
                    onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
                    rows={5}
                    required
                  />
                </div>

                {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Testimonial
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="glass-card rounded-full px-6 py-3">
              <p className="text-sm text-muted-foreground font-mono">
                <span className="text-primary">{testimonials.length}</span> Happy Clients
                <span className="ml-2 text-muted-foreground">Featured: {featuredTestimonials.length}</span>
              </p>
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
