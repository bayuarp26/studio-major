
export interface Contact {
  email: string;
  linkedin: string;
}

export interface Project {
  _id?: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  details: string;
  tags: string[];
  link: string;
}

export interface EducationItem {
  _id?: string;
  degree: string;
  school: string;
  period: string;
}

export interface Certificate {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  issuer: string;
  date: string;
  url: string;
}

export interface SoftwareSkill {
  _id?: string;
  name: string;
  iconUrl: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  cvUrl: string;
  profilePictureUrl: string;
  contact: Contact;
  softSkills: string[];
  hardSkills: string[];
  softwareSkills: SoftwareSkill[];
  projects: Project[];
  education: EducationItem[];
  certificates: Certificate[];
}

export interface User {
    username: string;
    password?: string; // Hashed password
}

export interface SessionPayload {
  username: string;
  expiresAt: Date;
}
