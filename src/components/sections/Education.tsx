import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface EducationItem {
  degree: string;
  school: string;
  period: string;
}

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <section id="education" className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Pendidikan
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Perjalanan akademis saya.
          </p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto">
          {education.map((edu) => (
            <Card key={edu.school} className="p-6 transition-shadow duration-300 hover:shadow-lg bg-card/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {edu.school}
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {edu.period}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
