// Dictionary types for components
export interface NavigationDictionary {
  nav: {
    profile: string;
    about: string;
    skills: string;
    services: string;
    projects: string;
    certificates: string;
    contactMe: string;
  };
}

export interface SectionDictionary {
  about: {
    title: string;
  };
  skills: {
    title: string;
    softSkills: string;
    hardSkills: string;
    softwareSkills: string;
  };
  projects: {
    title: string;
    description: string;
    viewDetails: string;
  };
  certificates: {
    title: string;
  };
  education: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    sendEmail: string;
  };
  services: {
    title: string;
    socialMediaSpecialist: string;
    digitalMarketing: string;
    buttonText: string;
  };
  hero: {
    downloadCV: string;
  };
  footer: {
    rights: string;
  };
  metadata: {
    portfolio: string;
  };
}

export type Dictionary = NavigationDictionary & SectionDictionary;
