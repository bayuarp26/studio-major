import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { MultilingualString } from "@/lib/types";
import type { Locale } from "../../../i18n.config";

interface HeroProps {
  name: string;
  title: MultilingualString | string;
  cvUrl: string;
  profilePictureUrl: string;
  dictionary: any;
  lang: Locale;
}

const getText = (field: MultilingualString | string | undefined, lang: Locale, fallback: string = ''): string => {
  if (typeof field === 'string') {
    return field;
  }
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] || field.id || fallback;
  }
  return fallback;
}

export default function Hero({ name, title, cvUrl, profilePictureUrl, dictionary, lang }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-start text-left">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Hello, I'm
            </span>
          </div>
          <h1 id="hero-name" className="font-headline text-5xl font-bold tracking-tight text-gray-900 md:text-6xl mb-4">
            {name}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {getText(title, lang)}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            Professional UX/UI Designer & Developer
          </p>
          
          <div className="flex items-center gap-4 mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3"
            >
              <a href={cvUrl} download={`CV-${name}.pdf`}>
                Download CV
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">12 K</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">200+</div>
              <div className="text-sm text-gray-600">Project Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">58</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
        
        {/* Profile Image */}
        <div className="relative order-first lg:order-last flex justify-center">
          <div className="relative h-[500px] w-[400px]">
            <Image
              src={profilePictureUrl}
              alt={`Foto profil ${name}`}
              fill
              className="object-cover"
              priority
              data-ai-hint="professional man"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
