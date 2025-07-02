
import { getPortfolioData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";

// This is a Server Component by default

export default async function ProfilePage() {
  const portfolioData = await getPortfolioData();

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="bg-background">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
              {portfolioData.name}
            </h1>
            <p className="mt-6 font-body text-lg leading-8 text-foreground/80 md:text-xl">
              {portfolioData.title}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <a href={portfolioData.cvUrl} download="CV-Wahyu-Pratomo.pdf">
                  <Download className="mr-2 h-5 w-5" />
                  Unduh CV
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  <Send className="mr-2 h-5 w-5" />
                  Hubungi Saya
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto h-80 w-80 flex-shrink-0 order-first lg:order-last">
            <Image
              src={portfolioData.profilePictureUrl}
              alt={`Foto profil ${portfolioData.name}`}
              fill
              className="rounded-full object-cover shadow-2xl"
              priority
              data-ai-hint="professional man"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-secondary">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-5">
            <div className="hidden lg:col-span-2 lg:block">
              <div className="relative mx-auto h-96 w-full max-w-sm">
                <Image
                  src={portfolioData.profilePictureUrl}
                  alt="Foto profil Wahyu Pratomo"
                  fill
                  className="rounded-xl object-cover shadow-lg"
                  data-ai-hint="professional man"
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-center font-headline text-4xl font-semibold text-primary sm:text-5xl lg:text-left">
                About Me
              </h2>
              <p className="mt-6 text-center text-lg leading-relaxed text-foreground/70 lg:text-left">
                {portfolioData.about}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
