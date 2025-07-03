
import { getPortfolioData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../../i18n.config';

export default async function ProfilePage({ params: { lang } }: { params: { lang: Locale } }) {
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
      <Skills 
        softSkills={portfolioData.softSkills}
        hardSkills={portfolioData.hardSkills}
        softwareSkills={portfolioData.softwareSkills}
        dictionary={dictionary} 
      />
      <Projects projects={portfolioData.projects} dictionary={dictionary} lang={lang} />
      <Education education={portfolioData.education} dictionary={dictionary} lang={lang} />
      <Certificates certificates={portfolioData.certificates} dictionary={dictionary} lang={lang} />
      <Services dictionary={dictionary} />
      <Contact contact={portfolioData.contact} dictionary={dictionary} />
    </>
  );
}
