'use client'

import Image from 'next/image'
import { Edit, ExternalLink, Github, Loader2, Star, StarOff, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { buildCloudinaryImageUrl } from '@/lib/cloudinary-images'
import type { Project } from '@/lib/types'

type ProjectsListProps = {
  projects: Project[]
  onToggleFeatured: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  deleteId: string | null
}

export function ProjectsList({
  projects,
  onToggleFeatured,
  onEdit,
  onDelete,
  deleteId
}: ProjectsListProps) {
  return (
    <div className="space-y-4 ">
      {projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-sm text-muted-foreground">
          No projects match the current filter.
        </div>
      ) : null}

      {projects.map((project) => (
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

              <div className="flex flex-wrap items-center gap-2">
                {project.coverImage?.url ? (
                  <Image
                    src={buildCloudinaryImageUrl(project.coverImage.url, 'thumbnail')}
                    alt={`${project.title} cover`}
                    width={64}
                    height={48}
                    unoptimized
                    className="h-12 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-16 items-center justify-center rounded-md bg-secondary text-xs text-muted-foreground">
                    No cover
                  </div>
                )}
                {project.galleryImages?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {project.galleryImages.slice(0, 4).map((image, index) => (
                      <Image
                        key={`${project.id}-gallery-${index}`}
                        src={buildCloudinaryImageUrl(image.url, 'gallery')}
                        alt={`${project.title} gallery ${index + 1}`}
                        width={64}
                        height={48}
                        unoptimized
                        className="h-12 w-16 rounded-md object-cover"
                      />
                    ))}
                    {project.galleryImages.length > 4 ? (
                      <span className="text-xs text-muted-foreground">+{project.galleryImages.length - 4}</span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No gallery</span>
                )}
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
              <Button type="button" variant="outline" size="icon" onClick={() => onToggleFeatured(project)}>
                {project.featured ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => onEdit(project)}>
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={deleteId === project.id}
                  >
                    {deleteId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you want to delete &quot;{project.title}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(project.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
