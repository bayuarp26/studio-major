
import { getPortfolioData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Tools from "@/components/sections/Tools";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";

// This page will render all sections for a single-page experience
export default async function ProfilePage() {
  const portfolioData = await getPortfolioData();

  return (
    <>
      <Hero 
        name={portfolioData.name} 
        title={portfolioData.title} 
        cvUrl={portfolioData.cvUrl} 
        profilePictureUrl={portfolioData.profilePictureUrl} 
      />
      <About 
        about={portfolioData.about} 
        profilePictureUrl={portfolioData.profilePictureUrl} 
      />
      <Skills skills={portfolioData.skills} />
      <Tools tools={portfolioData.tools} />
      <Projects projects={portfolioData.projects} />
      <Education education={portfolioData.education} />
      <Certificates certificates={portfolioData.certificates} />
      <Contact contact={portfolioData.contact} />
    </>
  );
}
