import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CTAProps {
  dictionary: any;
}

export default function CTA({ dictionary }: CTAProps) {
  return (
    <section className="py-24 sm:py-32 bg-slate-900">
      <div className="container text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-4xl font-bold text-white sm:text-5xl mb-6">
            Do you have Project Idea?
            <br />
            Let's discuss your project!
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available,
            but the majority have suffered alteration.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg"
          >
            <Link href="#contact">
              Let's work Together
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
