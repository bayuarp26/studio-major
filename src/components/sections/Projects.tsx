
import type { Project, MultilingualString } from '@/lib/types';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Locale } from '../../../i18n.config';

interface ProjectsProps {
  projects: Project[];
  dictionary: any;
  lang: Locale;
}

const getText = (field: MultilingualString | string | undefined, lang: Locale, fallback: string = ''): string => {
  if (typeof field === 'string') {
    return field;
  }
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] || field.id || fallback;
  }
  return fallback;
}

export default function Projects({ projects, dictionary, lang }: ProjectsProps) {
  return (
    <section id="projects" className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Portfolio
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
          </p>
        </div>
        
        {/* Portfolio Grid - 3x2 layout like in the design */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, index) => {
            const projectTitle = getText(project.title, lang, 'Untitled Project');
            const projectDescription = getText(project.description, lang);

            return (
              <Card key={`${projectTitle}-${index}`} className="group flex flex-col overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.imageUrl || 'https://placehold.co/400x300.png'}
                    alt={projectTitle}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={project.imageHint}
                  />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{projectTitle}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">{projectDescription}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            asChild 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3"
          >
            <Link href="/projects">
              View All
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
