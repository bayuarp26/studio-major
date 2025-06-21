import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Certificates() {
  return (
    <section id="certificates" className="bg-secondary/50 py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Certificates
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            My commitment to continuous learning and professional development.
          </p>
        </div>
        <div className="mt-16 space-y-8">
          {portfolioData.certificates.map((cert) => (
            <Card key={cert.name} className="transition-shadow duration-300 hover:shadow-lg">
              <div className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} - {cert.date}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" style={{borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))'}}>
                  <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                    View Certificate <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
