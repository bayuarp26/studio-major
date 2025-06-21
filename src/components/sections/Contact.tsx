import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container text-center">
        <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
          Get In Touch
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
          I'm currently open to new opportunities and collaborations. Feel free to reach out!
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button asChild size="lg" style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>
            <a href={portfolioData.contact.email}>
              <Mail className="mr-2 h-5 w-5" />
              Send an Email
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" style={{color: 'hsl(var(--accent))', borderColor: 'hsl(var(--accent))'}}>
            <Link href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              Connect on LinkedIn
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
