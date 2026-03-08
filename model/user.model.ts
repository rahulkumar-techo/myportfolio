/**
 * User Model
 * Contains portfolio data embedded inside the user document
 */

import mongoose, { Schema, model, models } from "mongoose";

/* ================= PROJECT ================= */

const ProjectSchema = new Schema({
  id: { type: String, required: true },
  title: String,
  description: String,
  longDescription: String,
  techStack: [String],
  imageUrl: String,
  galleryImages: [String],
  liveUrl: String,
  githubUrl: String,
  featured: Boolean,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

/* ================= SKILL ================= */

const SkillSchema = new Schema({
  id: { type: String, required: true },
  name: String,
  category: {
    type: String,
    enum: ["frontend", "backend", "devops", "tools", "languages"]
  },
  proficiency: Number,
  icon: String
});

/* ================= EXPERIENCE ================= */

const ExperienceSchema = new Schema({
  id: { type: String, required: true },
  title: String,
  company: String,
  companyUrl: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
  achievements: [String],
  technologies: [String]
});

/* ================= TESTIMONIAL ================= */

const TestimonialSchema = new Schema({
  id: { type: String, required: true },
  name: String,
  role: String,
  company: String,
  content: String,
  avatarUrl: String,
  rating: Number,
  submittedByEmail: String
});

/* ================= CONTACT MESSAGE ================= */

const ContactMessageSchema = new Schema({
  id: { type: String, required: true },
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
});

const SettingsSchema = new Schema({
  siteTitle: { type: String, default: "Developer Portfolio" },
  siteTagline: { type: String, default: "Futuristic Developer Portfolio" },
  adminPanelTitle: { type: String, default: "Admin Panel" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  resumeUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  twitterUrl: { type: String, default: "" },
  websiteUrl: { type: String, default: "" }
}, { _id: false });

/* ================= USER ================= */

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  image: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  createdAt: { type: Date, default: Date.now },

  projects: [ProjectSchema],
  skills: [SkillSchema],
  experiences: [ExperienceSchema],
  testimonials: [TestimonialSchema],
  contactMessages: [ContactMessageSchema],
  settings: { type: SettingsSchema, default: () => ({}) }
});

export const UserModel = models.User || model("User", UserSchema);
