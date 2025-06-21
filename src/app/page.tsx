
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Tools from "@/components/sections/Tools";
import Contact from "@/components/sections/Contact";
import { getPortfolioData } from "@/lib/data";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";

export default async function Home() {
  const portfolioData = await getPortfolioData();

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
        <Skills skills={portfolioData.skills} />
        <Projects projects={portfolioData.projects} />
        <Certificates certificates={portfolioData.certificates} />
        <Tools />
        <Contact contact={portfolioData.contact} />
      </main>
      <Footer />
    </div>
  );
}
