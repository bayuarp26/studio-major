import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

interface ContactInfo {
  email: string;
  linkedin?: string;
}

interface ContactProps {
  contact: ContactInfo;
}

export default function Contact({ contact }: ContactProps) {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container text-center">
        <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
          Hubungi Saya
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
          Saya terbuka untuk peluang dan kolaborasi baru. Jangan ragu untuk menghubungi saya!
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button asChild size="lg">
            <a href={contact.email}>
              <Mail className="mr-2 h-5 w-5" />
              Kirim Email
            </a>
          </Button>
          {contact.linkedin && (
            <Button asChild size="lg" className="bg-[#0A66C2] text-primary-foreground hover:bg-[#0A66C2]/90">
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
