
import { getPortfolioData } from "@/lib/data";
import ProjectList from "@/components/ProjectList";

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
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
