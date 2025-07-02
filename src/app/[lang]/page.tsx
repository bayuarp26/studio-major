
import { getPortfolioData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../i18n.config';

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
      />
      <About 
        about={portfolioData.about} 
        profilePictureUrl={portfolioData.profilePictureUrl} 
        dictionary={dictionary}
      />
      <Skills 
        softSkills={portfolioData.softSkills}
        hardSkills={portfolioData.hardSkills}
        softwareSkills={portfolioData.softwareSkills}
        dictionary={dictionary} 
      />
      <Projects projects={portfolioData.projects} dictionary={dictionary} />
      <Education education={portfolioData.education} dictionary={dictionary} />
      <Certificates certificates={portfolioData.certificates} dictionary={dictionary} />
      <Contact contact={portfolioData.contact} dictionary={dictionary} />
    </>
  );
}
