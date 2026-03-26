'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Folder } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import { buildCloudinaryImageUrl } from '@/lib/cloudinary-images';
import type { Project } from '@/lib/types';

function CaseStudyCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:transform hover:translate-y-[-4px]">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {project.coverImage?.url ? (
            <Image
              src={buildCloudinaryImageUrl(project.coverImage.url, 'thumbnail')}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="w-20 h-20 text-primary/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <div className="flex gap-2">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-transparent p-3 glass-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10"
                >
                  <ExternalLink className="w-5 h-5 text-primary transition-colors duration-300 hover:text-accent" />
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-transparent p-3 glass-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10"
                >
                  <Github className="w-5 h-5 text-foreground transition-colors duration-300 hover:text-primary" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <Link
            href={`/projects/${project.slug ?? project.id}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all"
          >
            View Case Study
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudiesPage() {
  const { caseStudies, isLoading, error } = useCaseStudies();

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative pt-16 pb-24 overflow-hidden md:pt-20">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
              CASE STUDIES
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-foreground">Featured </span>
              <span className="text-primary text-glow-cyan">Case Studies</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep dives into real-world builds with architecture, outcomes, and lessons learned.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <Link className="hover:text-primary transition-colors" href="/projects">All Projects</Link>
              <Link className="hover:text-primary transition-colors" href="/blog">Developer Blog</Link>
              <Link className="hover:text-primary transition-colors" href="/contact">Start a Project</Link>
            </div>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
              Loading case studies...
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
              Unable to load case studies right now.
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
              No featured case studies yet. Mark projects as featured in the admin panel.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((project, index) => (
                <CaseStudyCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
