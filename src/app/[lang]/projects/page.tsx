
import { getPortfolioData } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Project } from '@/lib/types';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../../i18n.config';

export const revalidate = 86400; // Revalidate every 24 hours

export default async function ProjectsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const { projects } = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <section id="projects" className="py-24 sm:py-32 bg-background">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            {dictionary.projects.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {dictionary.projects.description}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project, index: number) => (
            <Card key={`${project.title}-${index}`} className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                 <Image
                  src={project.imageUrl || 'https://placehold.co/600x400.png'}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={project.imageHint}
                />
              </div>
              <CardContent className="flex flex-grow flex-col p-6">
                <CardTitle className="text-xl font-bold text-primary">{project.title}</CardTitle>
                <p className="mt-3 flex-grow text-base text-foreground/80">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-end p-6 pt-0">
                <Button asChild variant="outline" disabled={!project.link || project.link === '#'}>
                    <Link href={project.link || '#'} target="_blank" rel="noopener noreferrer">
                        {dictionary.projects.viewDetails}
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
