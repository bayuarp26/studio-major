
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
    <section id="about" className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <div className="order-2 lg:order-1">
             <div className="relative mx-auto h-[500px] w-[400px]">
               <Image
                src={profilePictureUrl}
                alt="Professional photo"
                fill
                className="object-cover"
                data-ai-hint="professional man"
              />
             </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                About Me
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold text-gray-900 mb-6 leading-tight">
              I Design Products That People Love to Use.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {getText(about, lang)}
            </p>
            
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3"
            >
              <Link href="#contact">
                Download CV
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
