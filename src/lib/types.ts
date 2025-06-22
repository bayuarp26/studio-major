
export interface Contact {
  email: string;
  linkedin: string;
}

export interface Project {
  _id?: string; // Add optional _id for identifying documents
  title: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  details: string;
  tags: string[];
}

export interface EducationItem {
  _id?: string; // Add optional _id for identifying documents
  degree: string;
  school: string;
  period: string;
}

export interface Certificate {
  _id?: string; // Add optional _id for identifying documents
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
  skills: string[];
  projects: Project[];
  education: EducationItem[];
  certificates: Certificate[];
  tools: string[];
}

export interface User {
    username: string;
    password?: string; // Hashed password
}

export interface SessionPayload {
  username: string;
  expiresAt: Date;
}
