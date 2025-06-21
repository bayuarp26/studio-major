export interface Contact {
  email: string;
  linkedin: string;
}

export interface Project {
  title: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  details: string;
  tags: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  cvUrl: string;
  profilePictureUrl: string;
  contact: Contact;
  skills: string[];
  projects: Project[];
}
