'use client';

import { motion } from 'framer-motion';
import {
  FolderKanban,
  Cpu,
  Briefcase,
  MessageSquare,
  Mail,
  Eye,
  Clock,
  Settings,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { useExperience } from '@/hooks/useExperience';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useMessages } from '@/hooks/useMessages';
import { useAdminSettings } from '@/hooks/useSettings';

const statStyles = {
  projects: 'text-primary bg-primary/15',
  skills: 'text-accent bg-accent/15',
  experience: 'text-green-500 bg-green-500/15',
  testimonials: 'text-yellow-500 bg-yellow-500/15'
} as const;

export default function AdminDashboard() {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { experiences, isLoading: experienceLoading } = useExperience();
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { messages, isLoading: messagesLoading } = useMessages();
  const { settings } = useAdminSettings();

  const isLoading =
    projectsLoading || skillsLoading || experienceLoading || testimonialsLoading || messagesLoading;

  const stats = [
    { key: 'projects', label: 'Total Projects', value: projects.length, icon: FolderKanban, href: '/admin/projects' },
    { key: 'skills', label: 'Skills', value: skills.length, icon: Cpu, href: '/admin/skills' },
    { key: 'experience', label: 'Experience', value: experiences.length, icon: Briefcase, href: '/admin/experience' },
    { key: 'testimonials', label: 'Testimonials', value: testimonials.length, icon: MessageSquare, href: '/admin/testimonials' },
  ] as const;

  const quickActions = [
    { label: 'Manage Projects', icon: FolderKanban, href: '/admin/projects' },
    { label: 'Manage Skills', icon: Cpu, href: '/admin/skills' },
    { label: 'Manage Experience', icon: Briefcase, href: '/admin/experience' },
    { label: 'Open Settings', icon: Settings, href: '/admin/settings' },
  ];

  const latestMessages = messages.slice(0, 3);
  const featuredProjects = projects.filter((project: any) => project.featured).slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          {settings?.adminPanelTitle || 'Dashboard'}
        </motion.h1>
        <p className="text-muted-foreground">
          {settings?.siteTagline || 'Manage your portfolio data, branding, and public profile from one place.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link href={stat.href}>
              <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statStyles[stat.key]}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Eye className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Latest Messages
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/messages">
                <Mail className="w-4 h-4 mr-2" />
                View Inbox
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {latestMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages received yet.</p>
            ) : (
              latestMessages.map((message: any) => (
                <div key={message.id} className="rounded-lg bg-secondary/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{message.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {message.name} • {message.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {message.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Featured Projects</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/projects">View All</Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No featured projects configured yet.</p>
          ) : (
            featuredProjects.map((project: any) => (
              <div key={project.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <h3 className="font-medium text-foreground mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
