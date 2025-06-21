'use client';

import { useState, useEffect, useRef } from 'react';

export function useActiveSection(
  sectionIds: string[]
) {
  const [activeSection, setActiveSection] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '0px 0px -50% 0px'
    });

    const { current: currentObserver } = observer;

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        currentObserver.observe(element);
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [sectionIds]);

  return activeSection;
}
