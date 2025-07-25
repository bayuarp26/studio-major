'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced setActiveSection to improve performance
  const debouncedSetActiveSection = useCallback((sectionId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveSection(sectionId);
    }, 100);
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    // Optimized intersection observer with better performance settings
    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Get the section with the highest intersection ratio
          const mostVisible = visibleEntries.reduce((prev, current) => 
            prev.intersectionRatio > current.intersectionRatio ? prev : current
          );
          debouncedSetActiveSection(mostVisible.target.id);
        }
      },
      {
        rootMargin: '0px 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const { current: currentObserver } = observer;

    // Batch DOM queries for better performance
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    elements.forEach((element) => {
      if (element && currentObserver) {
        currentObserver.observe(element);
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sectionIds, debouncedSetActiveSection]);

  return activeSection;
}
