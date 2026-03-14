'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Folder, ExternalLink, Github, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buildCloudinaryImageUrl } from '@/lib/cloudinary-images';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/lib/types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:transform hover:translate-y-[-4px]">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {project.coverImage?.url ? (
            <Image
              src={buildCloudinaryImageUrl(project.coverImage.url, 'thumbnail')}
              alt={project.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="w-16 h-16 text-primary/30" />
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <div className="flex gap-2">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-transparent p-2 glass-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10"
                >
                  <ExternalLink className="w-5 h-5 text-primary transition-colors duration-300 hover:text-accent" />
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-transparent p-2 glass-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10"
                >
                  <Github className="w-5 h-5 text-foreground transition-colors duration-300 hover:text-primary" />
                </Link>
              )}
            </div>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-xs font-mono text-primary">
              Featured
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-xs text-muted-foreground">
            {project.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Link
            href={`/projects/${project.slug ?? project.id}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { projects, isLoading } = useProjects();
  const showcaseProjects =
    projects.filter((project: Project) => project.featured).slice(0, 3).length > 0
      ? projects.filter((project: Project) => project.featured).slice(0, 3)
      : projects.slice(0, 3);

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
            <Folder className="w-4 h-4" />
            SHOWCASE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Featured </span>
            <span className="text-primary text-glow-cyan">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for building
          </p>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseProjects.map((project: Project, index: number) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
