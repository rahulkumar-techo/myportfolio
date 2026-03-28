import { Schema, model, models } from "mongoose"

// Every portfolio resource belongs to a single user/admin owner.
const ownerField = {
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}

// Shared image metadata used by project cover and gallery images.
export const CloudinaryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    format: String,
    width: Number,
    height: Number,
    bytes: Number
  },
  { _id: false }
)

function galleryLimit(value: unknown[]) {
  return Array.isArray(value) && value.length <= 5
}

// Standalone collection for portfolio projects.
export const ProjectSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  title: String,
  description: String,
  slug: String,
  longDescription: String,
  problem: String,
  solution: String,
  architecture: String,
  results: String,
  techStack: [String],
  coverImage: { type: CloudinaryImageSchema, default: null },
  galleryImages: {
    type: [CloudinaryImageSchema],
    default: [],
    validate: [galleryLimit, "Gallery images must be 5 or fewer."]
  },
  liveUrl: String,
  githubUrl: String,
  featured: Boolean,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null }
})

ProjectSchema.index({ ownerId: 1, id: 1 }, { unique: true })
ProjectSchema.index({ ownerId: 1, slug: 1 })

// Blog posts for the public blog.
export const BlogPostSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  coverImage: { type: CloudinaryImageSchema, default: null },
  readingTime: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  publishedAt: { type: Date, default: null }
})

BlogPostSchema.index({ ownerId: 1, id: 1 }, { unique: true })
BlogPostSchema.index({ ownerId: 1, slug: 1 })

// Standalone collection for skills shown on the public site and admin.
export const SkillSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  name: String,
  category: {
    type: String,
    enum: ["frontend", "backend", "devops", "tools", "languages"]
  },
  proficiency: Number,
  icon: String,
  updatedAt: { type: Date, default: null }
})

SkillSchema.index({ ownerId: 1, id: 1 }, { unique: true })

// Standalone collection for experience history entries.
export const ExperienceSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  title: String,
  company: String,
  companyUrl: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  featured: { type: Boolean, default: false },
  description: String,
  achievements: [String],
  technologies: [String],
  updatedAt: { type: Date, default: null }
})

ExperienceSchema.index({ ownerId: 1, id: 1 }, { unique: true })

// Standalone collection for public testimonials.
export const TestimonialSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  name: String,
  role: String,
  company: String,
  content: String,
  avatarUrl: String,
  rating: Number,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  submittedByEmail: String
})

TestimonialSchema.index({ ownerId: 1, id: 1 }, { unique: true })

// Standalone collection for contact form submissions.
export const ContactMessageSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
})

ContactMessageSchema.index({ ownerId: 1, id: 1 }, { unique: true })

// Standalone collection for uploaded assets like CVs and certificates.
export const AssetSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  label: { type: String, required: true },
  category: {
    type: String,
    enum: ["cv", "achievement", "image", "certificate", "other"],
    default: "other"
  },
  featured: { type: Boolean, default: false },
  fileId: String,
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
})

AssetSchema.index({ ownerId: 1, id: 1 }, { unique: true })

// Standalone collection for temporary project image uploads.
export const TempProjectUploadSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

TempProjectUploadSchema.index({ ownerId: 1, id: 1 }, { unique: true })
TempProjectUploadSchema.index({ ownerId: 1, publicId: 1 })

// Standalone collection for temporary asset uploads.
export const TempAssetUploadSchema = new Schema({
  ...ownerField,
  id: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

TempAssetUploadSchema.index({ ownerId: 1, id: 1 }, { unique: true })
TempAssetUploadSchema.index({ ownerId: 1, publicId: 1 })

// Standalone collection for site and branding settings.
export const SettingsSchema = new Schema({
  ...ownerField,
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
  websiteUrl: { type: String, default: "" },
  adminNotificationSound: {
    type: String,
    enum: ["none", "beep", "chime", "soft"],
    default: "beep"
  }
})

SettingsSchema.index({ ownerId: 1 }, { unique: true })

// Email subscribers for notifications (non-auth visitors).
export const NotificationSubscriberSchema = new Schema({
  ...ownerField,
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "subscribed", "unsubscribed"],
    default: "pending"
  },
  verificationToken: { type: String, default: null },
  verificationExpiresAt: { type: Date, default: null },
  preferences: {
    blogs: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    assets: { type: Boolean, default: true }
  },
  source: { type: String, default: "website" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null }
})

NotificationSubscriberSchema.index({ ownerId: 1, email: 1 }, { unique: true })

// Push notification tokens (FCM).
export const PushSubscriberSchema = new Schema({
  ...ownerField,
  token: { type: String, required: true },
  preferences: {
    blogs: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    assets: { type: Boolean, default: true }
  },
  userAgent: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
})

PushSubscriberSchema.index({ ownerId: 1, token: 1 }, { unique: true })

// Notification feed entries (visible to subscribers).
export const NotificationLogSchema = new Schema({
  ...ownerField,
  type: {
    type: String,
    enum: ["project", "blog", "asset"],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
})

NotificationLogSchema.index({ ownerId: 1, createdAt: -1 })

// Models are reused during hot reload to avoid recompilation errors.
export const ProjectModel = models.Project || model("Project", ProjectSchema)
export const BlogPostModel = models.BlogPost || model("BlogPost", BlogPostSchema)
export const SkillModel = models.Skill || model("Skill", SkillSchema)
export const ExperienceModel = models.Experience || model("Experience", ExperienceSchema)
export const TestimonialModel = models.Testimonial || model("Testimonial", TestimonialSchema)
export const ContactMessageModel = models.ContactMessage || model("ContactMessage", ContactMessageSchema)
export const AssetModel = models.Asset || model("Asset", AssetSchema)
export const TempProjectUploadModel =
  models.TempProjectUpload || model("TempProjectUpload", TempProjectUploadSchema)
export const TempAssetUploadModel = models.TempAssetUpload || model("TempAssetUpload", TempAssetUploadSchema)
export const SettingsModel = models.Settings || model("Settings", SettingsSchema)
export const NotificationSubscriberModel =
  models.NotificationSubscriber || model("NotificationSubscriber", NotificationSubscriberSchema)
export const PushSubscriberModel =
  models.PushSubscriber || model("PushSubscriber", PushSubscriberSchema)
export const NotificationLogModel =
  models.NotificationLog || model("NotificationLog", NotificationLogSchema)
