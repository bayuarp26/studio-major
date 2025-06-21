
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";
import Link from 'next/link';
import { Button } from "../ui/button";

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
    if (!certificates || certificates.length === 0) return null;

  return (
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
          {certificates.map((cert) => (
            <Card key={cert.name} className="flex flex-col p-6 transition-shadow duration-300 hover:shadow-lg bg-card/50">
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
  );
}
