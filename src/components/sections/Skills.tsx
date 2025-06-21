interface SkillsProps {
  skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Keahlian Utama
          </h2>
           <div className="mx-auto mt-2 h-1.5 w-24 bg-primary" />
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
             <div key={`${skill}-${index}`} className="rounded-lg bg-foreground px-5 py-2.5 font-medium text-primary shadow-md dark:bg-card">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
