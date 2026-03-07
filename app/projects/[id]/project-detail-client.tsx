'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Folder, Code2, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Project } from '@/lib/types';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <article className="relative pt-32 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </motion.div>

          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Category & Date */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm font-mono text-primary">
                  <Folder className="w-4 h-4" />
                  {project.category}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
                {project.featured && (
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-mono">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">{project.title}</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-6">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" className="border-border hover:border-primary">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="glass-card rounded-2xl overflow-hidden aspect-video flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <Folder className="w-24 h-24 text-primary/30" />
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* About */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-primary" />
                    </span>
                    About the Project
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.longDescription || project.description}
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-accent" />
                    </span>
                    Key Features
                  </h2>
                  <ul className="space-y-3">
                    {[
                      'Modern responsive design',
                      'High performance optimization',
                      'Clean and maintainable code',
                      'Comprehensive documentation',
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="text-primary mt-1">{'>'}</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Gallery Placeholder */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <div className="glass-card rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Gallery</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.galleryImages.map((_, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
                        >
                          <Folder className="w-12 h-12 text-primary/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Tech Stack */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-2 text-sm font-mono bg-secondary rounded-lg text-foreground hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Info</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Category</dt>
                      <dd className="text-foreground">{project.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Year</dt>
                      <dd className="text-foreground">{new Date(project.createdAt).getFullYear()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="text-green-500">Completed</dd>
                    </div>
                  </dl>
                </div>

                {/* CTA */}
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Interested in a similar project?
                  </p>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/#contact">
                      Let&apos;s Talk
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
