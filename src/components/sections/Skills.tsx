'use client';

import type { SoftwareSkill } from '@/lib/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const SkillRotator = ({ skills }: { skills: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (skills.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
    }, 1750); // 1.75 seconds

    return () => clearInterval(intervalId);
  }, [skills.length]);

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No skills listed.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-2xl font-semibold text-primary h-full [perspective:1000px]">
      <div key={currentIndex} className="animate-flip-in-x">
        {skills[currentIndex]}
      </div>
    </div>
  );
};


interface SkillsProps {
  softSkills: string[];
  hardSkills: string[];
  softwareSkills: SoftwareSkill[];
  dictionary: any;
}

export default function Skills({ softSkills, hardSkills, softwareSkills, dictionary }: SkillsProps) {
  return (
    <section id="skills" className="bg-background">
      <div className="container py-24 sm:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dictionary.skills.title}
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-5xl space-y-12">
          {/* Soft Skills Card */}
          {softSkills && softSkills.length > 0 && (
            <div className="rounded-xl shadow-lg bg-card p-8 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 items-center min-h-[6rem]">
                <div className="md:col-span-1">
                  <h3 className="text-left text-2xl font-semibold tracking-tight">{dictionary.skills.softSkills}</h3>
                </div>
                <div className="md:col-span-3 mt-6 md:mt-0 h-full">
                  <SkillRotator skills={softSkills} />
                </div>
              </div>
            </div>
          )}

          {/* Hard Skills Card */}
          {hardSkills && hardSkills.length > 0 && (
            <div className="rounded-xl shadow-lg bg-card p-8 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 items-center min-h-[6rem]">
                <div className="md:col-span-1">
                  <h3 className="text-left text-2xl font-semibold tracking-tight">{dictionary.skills.hardSkills}</h3>
                </div>
                <div className="md:col-span-3 mt-6 md:mt-0 h-full">
                  <SkillRotator skills={hardSkills} />
                </div>
              </div>
            </div>
          )}

          {/* Software Skills Card */}
          {softwareSkills && softwareSkills.length > 0 && (
            <div className="rounded-xl shadow-lg bg-card p-8 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 items-start">
                <div className="md:col-span-1">
                  <h3 className="text-left text-2xl font-semibold tracking-tight">{dictionary.skills.softwareSkills}</h3>
                </div>
                <div className="md:col-span-3 mt-6 md:mt-0">
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
                        <p className="text-sm font-medium text-center">{skill.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
