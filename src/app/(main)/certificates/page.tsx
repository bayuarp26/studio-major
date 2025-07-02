
import { getPortfolioData } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Award, GraduationCap } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic'; // Dynamic fetching

export default async function CertificatesPage() {
  const { certificates, education } = await getPortfolioData();

  return (
    <>
      {/* Education Section */}
      <section id="education" className="bg-background py-24 sm:py-32">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
              Pendidikan
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Perjalanan akademis saya.
            </p>
          </div>
          <div className="relative mt-16 max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            <div className="space-y-12">
              {education.map((edu, index) => (
                <div key={`${edu.school}-${index}`} className="relative pl-12">
                   <div className="absolute left-6 top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-8 ring-background">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="mt-1 text-base font-medium text-primary">
                      {edu.school}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {edu.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="bg-secondary py-24 sm:py-32">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
              Sertifikat & Pelatihan
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Kredensial dan pelatihan yang telah saya selesaikan.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, index) => (
              <Card key={`${cert.name}-${index}`} className="flex flex-col p-6 transition-shadow duration-300 hover:shadow-lg bg-card/50">
                <div className="flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <Award className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{cert.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                      <p className="mt-1 text-sm font-medium text-primary">
                        {cert.date}
                      </p>
                    </div>
                  </div>
                </div>
                {cert.url && cert.url !== '#' && (
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                      <Button asChild variant="link" size="sm">
                          <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                              Lihat Kredensial
                          </Link>
                      </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
