import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/lib/data";
import { Github, ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32">
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
          {portfolioData.projects.map((project) => (
            <Card key={project.title} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl bg-card/50">
              <CardContent className="flex-grow p-6">
                <CardTitle className="font-headline text-xl font-semibold">{project.title}</CardTitle>
                <CardDescription className="mt-3 text-base text-foreground/70">{project.description}</CardDescription>
              </CardContent>
              {(project.liveUrl || project.sourceUrl) && (
                <CardFooter className="p-6 pt-0">
                  <div className="flex w-full justify-start gap-4">
                    {project.liveUrl && (
                      <Button asChild variant="link" className="p-0 h-auto text-accent">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.sourceUrl && (
                       <Button asChild variant="link" className="p-0 h-auto text-accent">
                        <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" /> Source Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
