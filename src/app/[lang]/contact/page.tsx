
import { getPortfolioData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../../i18n.config';

export const revalidate = 86400; // Revalidate every 24 hours

export default async function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
  const { contact } = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <section id="contact" className="py-24 sm:py-32 bg-secondary">
      <div className="container text-center">
        <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
          {dictionary.contact.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
          {dictionary.contact.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button asChild size="lg">
            <a href={contact.email}>
              <Mail className="mr-2 h-5 w-5" />
              {dictionary.contact.sendEmail}
            </a>
          </Button>
          {contact.linkedin && (
            <Button asChild size="lg" className="bg-gradient-to-r from-[#0080ff] to-[#00e0ff] text-white hover:shadow-lg">
              <Link href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
