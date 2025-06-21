export interface Contact {
  email: string;
  linkedin: string;
}

export interface Skill {
  name: string;
  icon: string;
  description: string;
}

export interface Project {
  title: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  details: string;
  tags: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  period: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  cvUrl: string;
  profilePictureUrl: string;
  contact: Contact;
  skills: Skill[];
  projects: Project[];
  education: EducationItem[];
  certificates: Certificate[];
}
