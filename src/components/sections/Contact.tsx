
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

interface ContactInfo {
  email: string;
  linkedin?: string;
}

interface ContactProps {
  contact: ContactInfo;
  dictionary: any;
}

export default function Contact({ contact, dictionary }: ContactProps) {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Get In Touch
          </span>
        </div>
        <h2 className="font-headline text-4xl font-bold text-portfolio-dark sm:text-5xl mb-4">
          {dictionary.contact.title}
        </h2>
        <p className="mx-auto max-w-xl text-lg text-portfolio-medium mb-10">
          {dictionary.contact.description}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6">
            <a href={contact.email}>
              <Mail className="mr-2 h-5 w-5" />
              {dictionary.contact.sendEmail}
            </a>
          </Button>
          {contact.linkedin && (
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6">
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
