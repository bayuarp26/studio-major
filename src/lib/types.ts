
import { WithId } from 'mongodb';

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
  skills: string[];
  projects: (Project & { id?: string })[]; // Allow optional 'id' from react-hook-form
  education: (EducationItem & { id?: string })[];
  certificates: (Certificate & { id?: string })[];
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
