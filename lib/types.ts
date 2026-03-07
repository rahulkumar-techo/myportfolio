// Portfolio Data Types

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  imageUrl: string;
  galleryImages?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'languages';
  proficiency: number; // 0-100
  icon?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  submittedByEmail?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
  archived?: boolean;
}

export interface SiteSettings {
  theme: 'light' | 'dark' | 'system';
  siteTitle: string;
  siteTagline: string;
  adminPanelTitle: string;
  bio: string;
  location: string;
  contactEmail: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  contributions: number;
  followers: number;
  following: number;
}

export interface DeveloperProfile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  email: string;
  resumeUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    coffeeConsumed: string;
  };
}
