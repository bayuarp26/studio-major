'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Briefcase, Leaf, Users, Handshake, type LucideIcon } from "lucide-react";

const iconMap: { [key: string]: LucideIcon } = {
  Target,
  Briefcase,
  Leaf,
  Users,
  Handshake,
};

interface Skill {
  name: string;
  icon: string;
  description: string;
}

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            My Skills
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            A look at the technologies and tools I work with.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => {
            const IconComponent = iconMap[skill.icon];
            if (!IconComponent) return null;

            return (
              <Card key={skill.name} className="flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconComponent className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-headline font-semibold">{skill.name}</CardTitle>
                  <p className="mt-2 text-muted-foreground">{skill.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
