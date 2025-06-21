import Image from "next/image";
import { portfolioData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Asterisk } from "lucide-react";

export default function Projects() {
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
          {portfolioData.projects.map((project, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-secondary p-8 text-center text-secondary-foreground">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-foreground">
                  <Image
                    src={project.logoUrl}
                    alt={`${project.handle} logo`}
                    width={80}
                    height={80}
                    className="rounded-full"
                    data-ai-hint={project.imageHint}
                  />
                </div>
                <h3 className="text-xl font-bold">{project.topTitle}</h3>
                <p className="flex items-center justify-center gap-1 text-sm text-foreground/70">
                  <Asterisk className="h-4 w-4" />/{project.handle}
                </p>
              </div>
              <div className="flex flex-grow flex-col bg-foreground p-6 text-background">
                <h4 className="text-xl font-bold text-primary">{project.title}</h4>
                <p className="mt-3 text-base text-background/80 flex-grow">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="border-0 bg-background px-3 py-1 text-primary hover:bg-background/90">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
