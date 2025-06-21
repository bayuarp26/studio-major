import { CodeXml, Github, PenTool, Server, ShieldCheck, Smartphone } from "lucide-react";

export const portfolioData = {
  name: "Wahyu Pratomo",
  title: "Frontend Engineer & UI/UX Designer",
  about: "A Frontend Engineer and UI/UX Designer with a passion for creating beautiful, intuitive, and highly crafted web experiences. I love to build and have a keen eye for design, interactions, and finishing touches.",
  cvUrl: "/wahyu-cv.pdf",
  contact: {
    email: "mailto:wahyu.kreatif@email.com",
    linkedin: "https://www.linkedin.com/in/wahyu-pratomo/",
  },
  skills: [
    { name: "Frontend Dev", icon: CodeXml, description: "React, Next.js, Tailwind CSS" },
    { name: "UI/UX Design", icon: PenTool, description: "Figma, Prototyping, User Research" },
    { name: "Backend Dev", icon: Server, description: "Node.js, Express" },
    { name: "Version Control", icon: Github, description: "Git & GitHub for code management" },
    { name: "TypeScript", icon: ShieldCheck, description: "For robust and scalable code" },
    { name: "Responsive Design", icon: Smartphone, description: "Mobile-first and adaptive layouts" },
  ],
  projects: [
    {
      title: "Hippo Marketplace",
      description: "A modern marketplace for digital assets, built with Next.js, TypeScript, and Payload CMS.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "digital marketplace",
      liveUrl: "https://hippo-marketplace.wahyupratomo.my.id/",
      sourceUrl: "https://github.com/wahyupratomo/hippo-marketplace",
    },
    {
      title: "Snake Game",
      description: "A classic snake game built with React.js and TypeScript, showcasing fundamental game development concepts.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "snake game",
      liveUrl: "https://snake-game.wahyupratomo.my.id/",
      sourceUrl: "https://github.com/wahyupratomo/snake-game",
    },
  ],
  certificates: [],
};
