// Portfolio Data Types

export interface CloudinaryImage {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  slug?: string;
  longDescription?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  results?: string;
  techStack: string[];
  coverImage?: CloudinaryImage | null;
  galleryImages?: CloudinaryImage[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  coverImage?: CloudinaryImage | null;
  readingTime?: string;
  featured?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  publishedAt?: string | Date | null;
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
  featured?: boolean;
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
  featured?: boolean;
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

export interface AssetItem {
  id: string;
  label: string;
  category: 'cv' | 'achievement' | 'image' | 'certificate' | 'other';
  featured?: boolean;
  fileId?: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  size: number;
  uploadedAt: string | Date;
}

export interface TempProjectUpload {
  id: string;
  publicId: string;
  url: string;
  createdAt: string | Date;
}

export interface TempAssetUpload {
  id: string;
  publicId: string;
  url: string;
  createdAt: string | Date;
}

export interface AnalyticsUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  blocked?: boolean;
  image?: string | null;
  lastLoginAt?: string | Date | null;
  lastLoginProvider?: string | null;
}

export interface StorageUsage {
  used: number;
  total: number;
  remaining: number;
}

export interface AdminAnalytics {
  totals: {
    users: number;
    admins: number;
    members: number;
    activeNow: number;
    blocked: number;
  };
  growth: {
    label: string;
    totalUsers: number;
  }[];
  activeUsers: AnalyticsUser[];
  users: AnalyticsUser[];
  storage: StorageUsage;
}

export interface SiteSettings {
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
  adminNotificationSound?: 'none' | 'beep' | 'chime' | 'soft';
}

export interface PublicProfileSummary {
  profile: {
    name: string;
    email: string;
    image?: string | null;
  };
  settings: SiteSettings;
  stats: {
    totalProjects: number;
    featuredProjects: number;
    totalSkills: number;
    totalExperience: number;
    yearsExperience: number;
    testimonials: number;
  };
  highlights: {
    topSkills: string[];
  };
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
