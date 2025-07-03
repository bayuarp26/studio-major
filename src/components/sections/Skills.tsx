
'use client';

import type { SoftwareSkill } from '@/lib/types';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SkillItem = ({ skill }: { skill: string }) => {
  return (
    <li className="group [perspective:1000px]">
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front Face */}
        <div className="flex items-center gap-2 [backface-visibility:hidden]">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="text-foreground/80">{skill}</span>
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 flex items-center gap-2 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">{skill}</span>
        </div>
      </div>
    </li>
  );
};

interface SkillsProps {
  softSkills: string[];
  hardSkills: string[];
  softwareSkills: SoftwareSkill[];
  dictionary: any;
}

export default function Skills({ softSkills, hardSkills, softwareSkills, dictionary }: SkillsProps) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } // Triggers when 10% of the section is visible
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="skills" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            {dictionary.skills.title}
          </h2>
        </div>

        <div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          className="mt-16 [perspective:2000px]"
        >
          <div
            className={`transition-all duration-1000 [transform-style:preserve-3d] ${
              isInView ? 'opacity-100 [transform:rotateY(0deg)]' : 'opacity-0 [transform:rotateY(-90deg)]'
            }`}
          >
            {/* Soft Skills */}
            <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-12">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold">{dictionary.skills.softSkills}</h3>
              </div>
              <div className="md:col-span-9">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {softSkills.map((skill, index) => (
                    <SkillItem key={`soft-${index}`} skill={skill} />
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-4 bg-border/50" />

            {/* Hard Skills */}
            <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-12">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold">{dictionary.skills.hardSkills}</h3>
              </div>
              <div className="md:col-span-9">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {hardSkills.map((skill, index) => (
                    <SkillItem key={`hard-${index}`} skill={skill} />
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-4 bg-border/50" />

            {/* Software Skills */}
            <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-12">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold">{dictionary.skills.softwareSkills}</h3>
              </div>
              <div className="md:col-span-9">
                <div className="grid grid-cols-3 place-items-start gap-x-6 gap-y-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {softwareSkills.map((skill) => (
                    <div key={skill._id} className="flex flex-col items-center gap-2">
                      <div className="relative h-16 w-16">
                        <Image
                          src={skill.iconUrl}
                          alt={skill.name}
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <p className="text-sm font-medium text-center text-foreground/80">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
