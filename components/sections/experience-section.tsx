'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, ExternalLink, MapPin, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useExperience } from '@/hooks/useExperience';
import type { Experience } from '@/lib/types';

function TimelineNode({ experience, index, isLast }: { 
  experience: Experience; 
  index: number; 
  isLast: boolean;
}) {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
    >
      {/* Timeline Line */}
      <div className="hidden md:flex flex-col items-center">
        {/* Node */}
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: experience.current 
                ? ['0 0 0 0 rgba(0, 212, 255, 0.4)', '0 0 0 20px rgba(0, 212, 255, 0)']
                : 'none',
            }}
            transition={{
              duration: 2,
              repeat: experience.current ? Infinity : 0,
            }}
            className={`w-6 h-6 rounded-full border-4 ${
              experience.current 
                ? 'bg-primary border-primary' 
                : 'bg-background border-border hover:border-primary'
            } transition-colors z-10`}
          />
          {experience.current && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-foreground" />
          )}
        </div>
        
        {/* Line */}
        {!isLast && (
          <div className="flex-1 w-0.5 bg-gradient-to-b from-border to-transparent min-h-[200px]" />
        )}
      </div>

      {/* Content Card */}
      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all"
        >
          {/* Header */}
          <div className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {experience.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {experience.companyUrl ? (
                  <Link
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {experience.company}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-primary">{experience.company}</span>
                )}
                {experience.current && (
                  <span className="px-2 py-0.5 text-xs font-mono bg-green-500/20 text-green-500 rounded-full">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className={`flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate!)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </span>
          </div>

          {/* Description */}
          <p className={`text-muted-foreground mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
            {experience.description}
          </p>

          {/* Achievements */}
          <ul className={`space-y-2 mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
            {experience.achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-start gap-2 text-sm text-muted-foreground ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <span className="text-primary mt-1">{'>'}</span>
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>

          {/* Technologies */}
          <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile Timeline Node */}
      <div className="md:hidden absolute left-0 top-0">
        <div className={`w-4 h-4 rounded-full border-2 ${
          experience.current 
            ? 'bg-primary border-primary' 
            : 'bg-background border-border'
        }`} />
        {!isLast && (
          <div className="absolute top-4 left-1.5 w-0.5 h-full bg-border" />
        )}
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { experiences, isLoading } = useExperience();
  const currentExperiences = experiences.filter((experience: Experience) => experience.current);

  return (
    <section id="experience" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
            <Briefcase className="w-4 h-4" />
            JOURNEY
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Full Stack </span>
            <span className="text-accent text-glow-purple">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience building scalable web products with Next.js, Node.js, AI, and microservices.
          </p>
        </motion.div>

        {/* Timeline */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : currentExperiences.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl p-10 text-center glass-card">
            <Briefcase className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-lg font-medium text-foreground">No current experience yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Mark an experience as current in the admin panel to display it here.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pl-6 md:pl-0 space-y-8">
            {currentExperiences.map((experience: Experience, index: number) => (
              <TimelineNode
                key={experience.id}
                experience={experience}
                index={index}
                isLast={index === currentExperiences.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
