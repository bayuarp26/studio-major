
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

// DEFINITIVE FIX: The data types now strictly represent the database schema.
// The optional 'id' from react-hook-form is removed, enforcing that only
// clean data is used throughout the application.
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
