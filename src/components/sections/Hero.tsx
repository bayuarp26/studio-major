import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <section id="hero" className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid min-h-[calc(100vh-4rem)] items-center gap-8 sm:gap-12 py-12 sm:py-16 lg:py-20 lg:grid-cols-2 lg:gap-20">
        {/* Content Section */}
        <div className="flex flex-col items-start text-left space-y-6 sm:space-y-8">
          <div className="mb-2 sm:mb-4">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
              {dictionary?.hero?.greeting || 'Hello, I\'m'}
            </span>
          </div>
          
          <h1 id="hero-name" className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            {name}
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
            {getText(title, lang)}
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-lg leading-relaxed">
            {dictionary?.hero?.description || 'Passionate about crafting high-impact social media campaigns from viral content creation to community engagement tailored to boost brand awareness, audience growth, and conversion.'}
          </p>
          
          <div className="flex items-center gap-3 sm:gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105"
            >
              <a href={cvUrl} download={`CV-${name}.pdf`}>
                {dictionary?.hero?.downloadCv || 'Download CV'}
              </a>
            </Button>
          </div>
        </div>
        
        {/* Profile Image - Responsive */}
        <div className="relative order-first lg:order-last flex justify-center mt-8 lg:mt-0">
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[480px] lg:w-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 shadow-2xl">
            <Image
              src={profilePictureUrl}
              alt={`Foto profil ${name}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 400px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
