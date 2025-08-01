
import type { Locale } from '../../i18n.config';

export type MultilingualString = {
  [key in Locale]: string;
};

export interface Contact {
  email: string;
  linkedin: string;
}

export interface Project {
  _id?: string;
  title: MultilingualString;
  imageUrl: string;
  imageHint: string;
  description: MultilingualString;
  details: string;
  tags: string[];
  link: string;
}

export interface EducationItem {
  _id?: string;
  degree: MultilingualString;
  school: MultilingualString;
  period: string;
}

export interface Certificate {
  _id?: string;
  name: MultilingualString;
  description: MultilingualString;
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
  title: MultilingualString;
  about: MultilingualString;
  cvUrl: string;
  profilePictureUrl: string;
  contact: Contact;
  workProcessVariant?: 'digital-marketing' | 'programming';
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

export interface AdminUser {
    _id?: string;
    username: string;
    password: string; // Hashed password
    email?: string;
    role: 'admin' | 'superadmin';
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
}

export interface SessionPayload {
  username: string;
  expiresAt: Date;
}
