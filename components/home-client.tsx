'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AIGuide = dynamic(() => import('@/components/ai-guide'), { ssr: false });

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'assets', 'experience', 'testimonials'];

export default function HomeClient() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) {
        return;
      }

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
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setShowGuide(true), { timeout: 2000 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = setTimeout(() => setShowGuide(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return showGuide ? <AIGuide currentSection={currentSection} /> : null;
}
