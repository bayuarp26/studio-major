
import type { SoftwareSkill } from '@/lib/types';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

        <div className="mt-16 space-y-12">
          {/* Soft Skills */}
          {softSkills && softSkills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{dictionary.skills.softSkills}</h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                {softSkills.map((skill, index) => (
                  <li key={`soft-${index}`} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Hard Skills */}
          {hardSkills && hardSkills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{dictionary.skills.hardSkills}</h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                {hardSkills.map((skill, index) => (
                  <li key={`hard-${index}`} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Separator />

          {/* Software Skills */}
          {softwareSkills && softwareSkills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{dictionary.skills.softwareSkills}</h3>
              <div className="mt-8 grid grid-cols-3 place-items-center gap-x-6 gap-y-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                {softwareSkills.map((skill) => (
                  <div key={skill._id} className="flex flex-col items-center gap-2">
                    <div className="relative h-16 w-16">
                      <Image
                        src={skill.iconUrl}
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{skill.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
