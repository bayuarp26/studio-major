
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import type { MultilingualString } from "@/lib/types";
import type { Locale } from "../../../i18n.config";

interface HeroProps {
  name: string;
  title: MultilingualString;
  cvUrl: string;
  profilePictureUrl: string;
  dictionary: any;
  lang: Locale;
}

export default function Hero({ name, title, cvUrl, profilePictureUrl, dictionary, lang }: HeroProps) {
  return (
    <section id="hero" className="bg-background">
      <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 id="hero-name" className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
            {name}
          </h1>
          <p className="mt-6 font-body text-lg leading-8 text-foreground/80 md:text-xl">
            {title[lang]}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <a href={cvUrl} download="CV-Wahyu-Pratomo.pdf">
                <Download className="mr-2 h-5 w-5" />
                {dictionary.hero.downloadCv}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">
                <Send className="mr-2 h-5 w-5" />
                {dictionary.nav.contactMe}
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto h-80 w-80 flex-shrink-0 order-first lg:order-last">
          <Image
            src={profilePictureUrl}
            alt={`Foto profil ${name}`}
            fill
            className="rounded-full object-cover shadow-2xl"
            priority
            data-ai-hint="professional man"
          />
        </div>
      </div>
    </section>
  );
}
