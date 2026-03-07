'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, ExternalLink, Github, ArrowRight, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/lib/data';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

const categories = ['All', ...new Set(projects.map(p => p.category))];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:transform hover:translate-y-[-4px]">
        {/* Project Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <Folder className="w-20 h-20 text-primary/30" />
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <div className="flex gap-2">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-5 h-5 text-foreground" />
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
          <p className="text-sm text-muted-foreground mb-4">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Link
            href={`/projects/${project.id}`}
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

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="relative pt-32 pb-24 overflow-hidden">
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
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
              <Folder className="w-4 h-4" />
              ALL PROJECTS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-foreground">Project </span>
              <span className="text-primary text-glow-cyan">Gallery</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore my complete collection of projects spanning various technologies and domains
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
          >
            <Filter className="w-4 h-4 text-muted-foreground mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'glass text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground mb-8"
          >
            Showing <span className="text-primary">{filteredProjects.length}</span> projects
          </motion.p>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
