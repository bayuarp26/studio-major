
import { getPortfolioData } from "@/lib/data";
import { GraduationCap } from "lucide-react";
import Certificates from "@/components/sections/Certificates";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/../i18n.config';
import type { MultilingualString } from "@/lib/types";

export const revalidate = 86400; // Revalidate every 24 hours

const getText = (field: MultilingualString | string | undefined, lang: Locale, fallback: string = ''): string => {
  if (typeof field === 'string') {
    return field;
  }
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return field[lang as keyof MultilingualString] || field.id || fallback;
  }
  return fallback;
}

export default async function CertificatesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const { certificates, education } = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <>
      {/* Education Section */}
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
                <div key={edu._id || index} className="relative pl-12">
                   <div className="absolute left-6 top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-8 ring-background">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold">{getText(edu.degree, lang)}</h3>
                    <p className="mt-1 text-base font-medium text-primary">
                      {getText(edu.school, lang)}
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

      {/* Certificates Section */}
      <Certificates certificates={certificates} dictionary={dictionary} lang={lang} />
    </>
  );
}
