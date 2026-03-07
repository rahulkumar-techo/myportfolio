'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import AIGuide from '@/components/ai-guide';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/sections/about-section'), { ssr: false });
const SkillsSection = dynamic(() => import('@/components/sections/skills-section'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/components/sections/projects-section'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/sections/experience-section'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/sections/contact-section'), { ssr: false });

export default function Home() {
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'testimonials', 'contact'];
    
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setCurrentSection(id);
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main className="relative">
      {/* Navigation */}
      <Navigation />
      
      {/* AI Guide */}
      <AIGuide currentSection={currentSection} />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Skills Section */}
      <SkillsSection />
      
      {/* Projects Section */}
      <ProjectsSection />
      
      {/* Experience Section */}
      <ExperienceSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
