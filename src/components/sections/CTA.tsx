import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "../../../i18n.config";

interface CTAProps {
  dictionary: any;
  lang?: Locale;
}

export default function CTA({ dictionary, lang = 'id' }: CTAProps) {
  return (
    <section className="py-24 sm:py-32 bg-slate-900">
      <div className="container text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-4xl font-bold text-white sm:text-5xl mb-6">
            {dictionary?.cta?.title || (lang === 'id' 
              ? 'Siap Untuk Memulai?\nMari wujudkan proyek Anda!'
              : 'Do you have Project Idea?\nLet\'s discuss your project!'
            )}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {dictionary?.cta?.description || (lang === 'id'
              ? 'Mari wujudkan ide digital Anda menjadi kenyataan. Hubungi saya untuk konsultasi gratis!'
              : 'Let\'s turn your digital ideas into reality. Contact me for a free consultation!'
            )}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg"
          >
            <Link href="#contact">
              {dictionary?.cta?.button || (lang === 'id' ? 'Mulai Proyek' : 'Let\'s work Together')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
