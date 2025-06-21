import { CodeXml, Database, LayoutTemplate, PenTool, Server, Smartphone } from "lucide-react";

export const portfolioData = {
  name: "Wahyu",
  title: "Creative Web Developer & UI/UX Enthusiast",
  about: "I am a passionate web developer with a keen eye for design and user experience. I love crafting beautiful, functional, and responsive websites and applications. My journey in tech is driven by a constant desire to learn and create innovative solutions that make a difference.",
  cvUrl: "/wahyu-cv.pdf",
  contact: {
    email: "mailto:wahyu.kreatif@email.com",
    linkedin: "https://linkedin.com/in/wahyu",
  },
  skills: [
    { name: "Frontend Dev", icon: CodeXml, description: "React, Next.js, Tailwind CSS" },
    { name: "Backend Dev", icon: Server, description: "Node.js, Express, Firebase" },
    { name: "Database", icon: Database, description: "SQL, MongoDB, Prisma" },
    { name: "UI/UX Design", icon: PenTool, description: "Figma, User Research" },
    { name: "Responsive Design", icon: LayoutTemplate, description: "Mobile-first layouts" },
    { name: "App Dev", icon: Smartphone, description: "React Native" },
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description: "A full-featured e-commerce site with product listings, shopping cart, and payment integration.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ecommerce website",
      liveUrl: "#",
      sourceUrl: "#",
    },
    {
      title: "Portfolio Website",
      description: "A personal portfolio to showcase my skills and projects, built with Next.js and Tailwind CSS.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "portfolio website",
      liveUrl: "#",
      sourceUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A web application to help users organize their tasks and improve productivity.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "task app",
      liveUrl: "#",
      sourceUrl: "#",
    },
     {
      title: "Blog Platform",
      description: "A content management system for creating and publishing blog posts with a modern interface.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "blog interface",
      liveUrl: "#",
      sourceUrl: "#",
    },
  ],
  certificates: [
    {
      name: "Certified JavaScript Developer",
      issuer: "Tech Certification Inc.",
      date: "2023",
      url: "#",
    },
    {
      name: "UI/UX Design Professional",
      issuer: "Design Institute",
      date: "2022",
      url: "#",
    },
    {
      name: "Full-Stack Web Development",
      issuer: "Coding Bootcamp Pro",
      date: "2022",
      url: "#",
    },
  ],
};
