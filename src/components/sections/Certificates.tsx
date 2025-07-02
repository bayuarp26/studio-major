
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
import type { Certificate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface CertificatesProps {
  certificates: Certificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
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
    <section id="certificates" className="bg-secondary py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Sertifikasi/Lisensi
          </h2>
        </div>
        <div className="mt-16 mx-auto max-w-4xl">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ loop: true }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {certificates.map((cert, index) => (
                <CarouselItem key={cert._id || index}>
                  <Card className="overflow-hidden border-none shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full rounded-lg bg-muted/40">
                        <Image
                          src={cert.imageUrl || 'https://placehold.co/800x600.png'}
                          alt={cert.name}
                          fill
                          sizes="(min-width: 1024px) 768px, 100vw"
                          className="object-contain"
                          data-ai-hint={cert.imageHint || 'certificate document'}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="absolute left-[-80px] top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/80 hover:bg-primary text-primary-foreground" />
              <CarouselNext className="absolute right-[-80px] top-1/2 -translate-y-1/2 h-12 w-12 bg-primary/80 hover:bg-primary text-primary-foreground" />
            </div>
          </Carousel>

          {selectedCert && (
            <div className="mt-8 text-center">
                <div className="flex justify-center items-center gap-4">
                    <Button variant="ghost" size="icon" className="sm:hidden rounded-full bg-primary/80 hover:bg-primary text-primary-foreground" onClick={() => api?.scrollPrev()}><ArrowLeft className="h-5 w-5"/></Button>
                    <div className="flex-grow">
                        <h3 className="text-2xl font-semibold text-primary">{selectedCert.name}</h3>
                        <p className="mt-2 text-foreground/70 max-w-2xl mx-auto">{selectedCert.description}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="sm:hidden rounded-full bg-primary/80 hover:bg-primary text-primary-foreground" onClick={() => api?.scrollNext()}><ArrowRight className="h-5 w-5"/></Button>
                </div>
            </div>
          )}
          
          <div className="py-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: count }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${current === index + 1 ? 'w-6 bg-primary' : 'w-2 bg-primary/50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
