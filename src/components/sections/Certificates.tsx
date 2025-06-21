import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="bg-secondary/30 py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Pendidikan & Pelatihan
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Perjalanan akademis dan profesional saya dalam menimba ilmu.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioData.certificates.map((cert) => (
            <Card key={cert.name} className="p-6 transition-shadow duration-300 hover:shadow-lg bg-card/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cert.issuer}
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {cert.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
