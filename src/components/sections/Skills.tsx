import type { SoftwareSkill } from '@/lib/types';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

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
            <div className="group [perspective:1000px]">
              <div className="relative rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Face */}
                <div className="w-full rounded-xl bg-card p-8 border [backface-visibility:hidden]">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 items-start">
                    <div className="md:col-span-1">
                      <h3 className="text-left text-2xl font-semibold tracking-tight">{dictionary.skills.softSkills}</h3>
                    </div>
                    <div className="md:col-span-3 mt-6 md:mt-0">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {softSkills.map((skill, index) => (
                          <li key={`soft-${index}`} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-foreground/80">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-primary text-primary-foreground p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex min-h-full flex-col items-center justify-center">
                    <h3 className="text-3xl font-bold">{dictionary.skills.softSkills}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hard Skills Card */}
          {hardSkills && hardSkills.length > 0 && (
            <div className="group [perspective:1000px]">
              <div className="relative rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Face */}
                <div className="w-full rounded-xl bg-card p-8 border [backface-visibility:hidden]">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 items-start">
                    <div className="md:col-span-1">
                      <h3 className="text-left text-2xl font-semibold tracking-tight">{dictionary.skills.hardSkills}</h3>
                    </div>
                    <div className="md:col-span-3 mt-6 md:mt-0">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {hardSkills.map((skill, index) => (
                          <li key={`hard-${index}`} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-foreground/80">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-primary text-primary-foreground p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex min-h-full flex-col items-center justify-center">
                    <h3 className="text-3xl font-bold">{dictionary.skills.hardSkills}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Software Skills Card */}
          {softwareSkills && softwareSkills.length > 0 && (
            <div className="group [perspective:1000px]">
              <div className="relative rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Face */}
                <div className="w-full rounded-xl bg-card p-8 border [backface-visibility:hidden]">
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
                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-primary text-primary-foreground p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                   <div className="flex min-h-full flex-col items-center justify-center">
                    <h3 className="text-3xl font-bold">{dictionary.skills.softwareSkills}</h3>
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
