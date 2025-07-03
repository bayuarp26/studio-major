
import { GraduationCap } from "lucide-react";
import type { EducationItem } from "@/lib/types";
import type { Locale } from "../../../i18n.config";

interface EducationProps {
  education: EducationItem[];
  dictionary: any;
  lang: Locale;
}

export default function Education({ education, dictionary, lang }: EducationProps) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            {dictionary.education.title}
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            {dictionary.education.description}
          </p>
        </div>
        <div className="relative mt-16 max-w-2xl mx-auto">
          <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {education.map((edu, index) => (
              <div key={`${edu.school[lang]}-${index}`} className="relative pl-12">
                 <div className="absolute left-6 top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-8 ring-background">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree[lang]}</h3>
                  <p className="mt-1 text-base font-medium text-primary">
                    {edu.school[lang]}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {edu.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
