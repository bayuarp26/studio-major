import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Hero() {
  return (
    <section id="hero" className="bg-secondary/30">
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-20 text-center">
        <div className="max-w-3xl">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
            {portfolioData.name}
          </h1>
          <p className="mt-6 font-body text-lg leading-8 text-foreground/80 md:text-xl">
            {portfolioData.title}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <a href={portfolioData.cvUrl} download>
                <Download className="mr-2 h-5 w-5" />
                Unduh CV
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">
                <Send className="mr-2 h-5 w-5" />
                Hubungi Saya
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
