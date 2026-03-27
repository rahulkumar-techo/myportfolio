'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/usePublicProfile';

export default function AboutPreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { profile } = usePublicProfile();

  const rawAvatarUrl = typeof profile?.profile.image === 'string' ? profile.profile.image.trim() : '';
  const isGoogleAvatar = /googleusercontent\.com|ggpht\.com/i.test(rawAvatarUrl);
  const avatarUrl = !isGoogleAvatar && rawAvatarUrl ? rawAvatarUrl : '/avatar.png';
  const profileName = profile?.profile.name || profile?.settings.siteTitle || 'Portfolio Owner';
  const tagline =
    profile?.settings.siteTagline ||
    'Full Stack Developer, Next.js Developer, and Node.js Developer focused on fast, SEO-ready web apps.';
  const bio =
    profile?.settings.bio ||
    'I build production-ready web products with clean architecture, performance-first UX, and measurable impact.';

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono text-primary glass-card">
            <Code2 className="h-4 w-4" />
            ABOUT
          </span>
          <h2 className="mt-6 text-3xl font-bold md:text-5xl">
            <span className="text-foreground">About </span>
            <span className="text-primary text-glow-cyan">{profileName}</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">{tagline}</p>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto"
          >
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-accent/20">
              <Image
                src={avatarUrl}
                alt={`${profileName} avatar`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <p className="text-sm text-muted-foreground md:text-base leading-relaxed">{bio}</p>
            <p className="mt-4 text-sm text-muted-foreground md:text-base leading-relaxed">
              The full story covers my background, workflow, and how I deliver Next.js, Node.js, and AI projects with
              strong SEO and performance from day one.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary hover:bg-primary/10"
              >
                Read Full About
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
