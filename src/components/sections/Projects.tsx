
import type { Project } from '@/lib/types';
import ProjectList from "@/components/ProjectList";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="bg-secondary py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Proyek Portofolio
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            Berikut adalah beberapa proyek yang telah saya kerjakan untuk menunjukkan keahlian saya.
          </p>
        </div>
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
