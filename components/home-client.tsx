'use client';

import { useEffect, useState } from 'react';
import AIGuide from '@/components/ai-guide';

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'assets', 'experience', 'testimonials'];

export default function HomeClient() {
  const [currentSection, setCurrentSection] = useState('hero');

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

  return <AIGuide currentSection={currentSection} />;
}
