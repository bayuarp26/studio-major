import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Tools from "@/components/sections/Tools";
import Contact from "@/components/sections/Contact";
import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/lib/types';

const getPortfolioData = (): PortfolioData => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'portfolio-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load portfolio data for page, returning fallback. Error: ", error);
    // Return a fallback object if the file can't be read to prevent crash
    return {
      name: "Error",
      title: "Could not load data",
      about: "",
      cvUrl: "",
      profilePictureUrl: "",
      contact: { email: "", linkedin: "" },
      skills: [],
      projects: [],
      education: [],
      certificates: [],
    };
  }
};


export default function Home() {
  const portfolioData = getPortfolioData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header name={portfolioData.name} />
      <main className="flex-grow">
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
        <Education education={portfolioData.education} />
        <Certificates certificates={portfolioData.certificates} />
        <Skills skills={portfolioData.skills} />
        <Projects projects={portfolioData.projects} />
        <Tools />
        <Contact contact={portfolioData.contact} />
      </main>
      <Footer />
    </div>
  );
}
