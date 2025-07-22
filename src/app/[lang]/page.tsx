import { getPortfolioData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import WorkProcess from "@/components/sections/WorkProcess";
import CTA from "@/components/sections/CTA";
import Blog from "@/components/sections/Blog";
import ContactProject from "@/components/sections/ContactProject";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../../i18n.config';

export default async function ProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const portfolioData = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Hero 
        name={portfolioData.name} 
        title={portfolioData.title} 
        cvUrl={portfolioData.cvUrl} 
        profilePictureUrl={portfolioData.profilePictureUrl} 
        dictionary={dictionary}
        lang={lang}
      />
      <About 
        about={portfolioData.about} 
        profilePictureUrl={portfolioData.profilePictureUrl} 
        dictionary={dictionary}
        lang={lang}
      />
      <WorkProcess dictionary={dictionary} />
      <Projects projects={portfolioData.projects} dictionary={dictionary} lang={lang} />
      <CTA dictionary={dictionary} />
      <Blog dictionary={dictionary} />
      <Certificates 
        certificates={portfolioData.certificates} 
        dictionary={dictionary} 
        lang={lang} 
      />
      <Services dictionary={dictionary} />
      <ContactProject 
        dictionary={dictionary} 
        contact={portfolioData.contact}
        name={portfolioData.name}
      />
    </>
  );
}
