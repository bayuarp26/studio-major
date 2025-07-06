
import Image from 'next/image';
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
    <section id="about" className="py-24 sm:py-32 bg-secondary">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-5">
          <div className="hidden lg:col-span-2 lg:block">
             <div className="relative mx-auto h-96 w-full max-w-sm">
               <Image
                src={profilePictureUrl}
                alt="Foto profil Wahyu Pratomo"
                fill
                className="rounded-xl object-cover shadow-lg"
                data-ai-hint="professional man"
              />
             </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-headline text-center text-4xl font-semibold text-primary sm:text-5xl lg:text-left">
              {dictionary.about.title}
            </h2>
            <p className="mt-6 text-center text-lg leading-relaxed text-foreground/70 lg:text-left">
              {getText(about, lang)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
