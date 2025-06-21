import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Certificates";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Tools from "@/components/sections/Tools";
import Contact from "@/components/sections/Contact";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Tools />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
