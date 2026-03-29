'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import TypingText from '@/components/typing-text';
// import HeroScene from '@/components/three/hero-scene';

export default function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { profile } = usePublicProfile();

  const DEFAULT_HERO = {
    name: 'Rahul Kumar',
    tagline: 'Full Stack Developer | Next.js, Node.js, and AI',
    bio:
      'Rahul Kumar builds fast, scalable web applications and AI-powered products that turn traffic into customers, with clean architecture, technical SEO, and measurable impact.',
    topSkills: ['React', 'Next.js', 'TypeScript', 'Node.js']
  };

  const headingName = profile?.settings.siteTitle || profile?.profile.name || DEFAULT_HERO.name;
  const techPreview = profile?.highlights.topSkills?.length
    ? profile.highlights.topSkills
    : DEFAULT_HERO.topSkills;
  const taglineRaw =
    profile?.settings.siteTagline || DEFAULT_HERO.tagline;
  const taglineParts = taglineRaw.split('|').map((part) => part.trim()).filter(Boolean);
  const taglineLead = taglineParts.length > 1 ? `${taglineParts[0]} | ` : taglineRaw;
  const taglineTyped = taglineParts.length > 1 ? taglineParts.slice(1).join(' | ') : '';
  const heroBio =
    profile?.settings.bio ||
    `${headingName} builds fast, scalable web applications and AI-powered products that turn traffic into customers, with clean architecture, technical SEO, and measurable impact.`;

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* 3D Scene */}
      {/* <div className="absolute inset-0 z-0">
        {showScene ? (
         <video
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
>
  <source src="/sora-2.mp4" type="video/mp4" />
</video>
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-background via-background/80 to-background" />
        )}
      </div> */}

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 scanlines z-0" />

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100svh] pt-20 pb-14 flex flex-col justify-start sm:justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-6 glass-card rounded-full text-xs xs:text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground">
              {profile?.stats.featuredProjects
                ? `${profile.stats.featuredProjects} featured projects live`
                : 'Available for new projects'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mb-5 sm:mb-6 leading-tight text-balance"
          >
            <span className="text-foreground">{taglineLead}</span>
            {taglineTyped ? (
              <span className="text-primary">
                <TypingText
                  text={taglineTyped}
                  speed={38}
                  delay={300}
                  loop
                  pause={1600}
                />
              </span>
            ) : null}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-base xs:text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {heroBio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
          >
            <Button
              asChild
              size="lg"
              className="group relative w-full max-w-xs sm:w-auto overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              <Link href="#projects">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  View Projects
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full max-w-xs sm:w-auto border-border hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Link href="/contact">
                <Zap className="w-5 h-5 mr-2" />
                Get in Touch
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full max-w-xs sm:w-auto border-border hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Link href="/blog">
                Read the Blog
              </Link>
            </Button>
          </motion.div>

          {/* Tech Stack Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {techPreview.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                className="cursor-default rounded-md border border-transparent px-3 py-1 text-xs font-mono text-muted-foreground glass-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden xs:flex"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground font-mono">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
}
