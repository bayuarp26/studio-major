
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { MultilingualString } from '@/lib/types';
import type { Locale } from '../../../i18n.config';

interface AboutProps {
  about: MultilingualString | string;
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

export default function About({ about, profilePictureUrl, dictionary, lang }: AboutProps) {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid items-center gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2">
          {/* Image - Hidden on mobile */}
          <div className="hidden md:block order-2 lg:order-1">
             <div className="relative mx-auto h-[500px] w-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100">
               <Image
                src={profilePictureUrl}
                alt="Professional photo"
                fill
                className="object-cover"
                data-ai-hint="professional man with arms crossed, smiling, business casual attire"
              />
             </div>
          </div>
          
          <div className="order-1 lg:order-2 w-full">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {dictionary?.about?.badge || 'About Me'}
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {dictionary?.about?.title || 'I am Professional User Experience Designer'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              {getText(about, lang) || dictionary?.about?.description || 'I design and develop services for customers specializing creating stylish, modern websites, web services and online stores. My passion is to design digital user experiences through meaningful interactions.'}
            </p>
            
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 touch-manipulation"
            >
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
