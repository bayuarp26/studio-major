
import { getPortfolioData } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const revalidate = 86400; // Revalidate every 24 hours

export default async function ProjectsPage() {
  const { projects } = await getPortfolioData();

  return (
    <section id="projects" className="py-24 sm:py-32 bg-background">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Proyek Portofolio
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            Berikut adalah beberapa proyek yang telah saya kerjakan untuk menunjukkan keahlian saya.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
