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
            Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            Here are some of the projects I'm proud to have worked on.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioData.projects.map((project) => (
            <Card key={project.title} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={project.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="font-headline text-2xl font-semibold">{project.title}</CardTitle>
                <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex w-full justify-start gap-4">
                  <Button asChild variant="link" className="p-0 h-auto text-accent">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                  <Button asChild variant="link" className="p-0 h-auto text-accent">
                    <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Source Code
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
