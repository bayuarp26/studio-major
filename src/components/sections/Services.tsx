
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

interface ServicesProps {
  dictionary: any;
}

export default function Services({ dictionary }: ServicesProps) {
  const userProvidedLink = "https://api.whatsapp.com/send/?phone=6282286514244&text=Halo%2C%20aku%20mau%20kerja%20sama%20untuk%20digital%20marketing%20nih&type=phone_number&app_absent=0";

  const servicesData = [
      { title: dictionary.services.logoDesign },
      { title: dictionary.services.bannerDesign },
  ];

  return (
    <section id="services" className="bg-secondary py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            {dictionary.services.title}
          </h2>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {servicesData.map((service, index) => (
            <Card key={index} className="bg-foreground text-background shadow-lg rounded-xl overflow-hidden group transform transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                <div className="rounded-full border-2 border-primary/50 p-4 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-background">{service.title}</h3>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                  <Link href={userProvidedLink} target="_blank" rel="noopener noreferrer">
                    {dictionary.services.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
