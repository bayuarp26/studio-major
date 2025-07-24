
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { Certificate, MultilingualString } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Locale } from '../../../i18n.config';

interface CertificatesProps {
  certificates: Certificate[];
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

export default function Certificates({ certificates, dictionary, lang }: CertificatesProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 1750, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!certificates || certificates.length === 0) return null;

  const selectedCert = certificates[current - 1];

  return (
    <section id="certificates" className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            {dictionary?.certificates?.title || 'My Certificates'}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {dictionary?.certificates?.description || 'Professional certifications and achievements that showcase my expertise and commitment to continuous learning.'}
          </p>
        </div>
        <div className="mt-16 mx-auto max-w-4xl flex justify-center">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ loop: true }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {certificates.map((cert, index) => {
                const certName = getText(cert.name, lang, 'Untitled Certificate');
                return (
                  <CarouselItem key={cert._id || index}>
                    <Card className="overflow-hidden border border-gray-200 shadow-lg bg-white rounded-2xl mx-auto">
                      <CardContent className="p-6 text-center">
                        <div className="relative aspect-[16/9] w-full rounded-lg bg-gray-50 mb-6 mx-auto">
                          <Image
                            src={cert.imageUrl || 'https://placehold.co/800x600.png'}
                            alt={certName}
                            fill
                            sizes="(min-width: 1024px) 768px, 100vw"
                            className="object-contain rounded-lg"
                            data-ai-hint={cert.imageHint || 'certificate document'}
                          />
                        </div>
                        <div className="text-center space-y-3 max-w-md mx-auto">
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">{certName}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed mx-auto">{getText(cert.description, lang)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="absolute left-[-80px] top-1/2 -translate-y-1/2 h-12 w-12 bg-purple-600 hover:bg-purple-700 text-white border-0" />
              <CarouselNext className="absolute right-[-80px] top-1/2 -translate-y-1/2 h-12 w-12 bg-purple-600 hover:bg-purple-700 text-white border-0" />
            </div>
          </Carousel>

        </div>
      </div>
    </section>
  );
}
