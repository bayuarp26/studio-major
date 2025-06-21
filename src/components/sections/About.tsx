import { portfolioData } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            About Me
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            {portfolioData.about}
          </p>
        </div>
      </div>
    </section>
  );
}
