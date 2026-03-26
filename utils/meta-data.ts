/**
 * High-performance SEO metadata for Rahul Kumar Portfolio
 * Optimized for Google ranking, social sharing, and recruiter visibility
 */

import type { Metadata } from "next";

export const siteUrl = "https://rahulkumardev.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // 🔥 Title Optimization (SEO + CTR)
  title: {
    default:
      "Full Stack Developer | Next.js, Node.js, AI, Microservices",
    template: "%s | Rahul Kumar",
  },

  // 🔥 Strong Description (Google + Recruiters)
  description:
    "Rahul Kumar builds fast, scalable web apps with Next.js, Node.js, AI, and microservices. Explore projects, case studies, skills, and the developer blog.",

  // 🔥 SEO Identity
  applicationName: "Rahul Kumar Portfolio",
  authors: [{ name: "Rahul Kumar", url: siteUrl }],
  creator: "Rahul Kumar",
  publisher: "Rahul Kumar",

  // 🔥 Category Boost
  category: "Technology, Software Development, Portfolio",

  // 🔥 Referrer Policy
  referrer: "origin-when-cross-origin",

  // 🔥 Prevent auto-detection issues
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // 🔥 Google Verification
  verification: {
    google: "_QNLV10mzA4nAID8UI4QvIrm0l1lhA_LRLgAZqmO7ak",
  },

  // 🔥 CLEAN KEYWORDS (No Spam)
  keywords: [
    "Rahul Kumar",
    "Full Stack Developer India",
    "Next.js Developer",
    "Node.js Developer",
    "React Developer",
    "AI Developer",
    "Microservices Developer",
    "Software Engineer Portfolio",
    "Web Developer Portfolio",
  ],

  // 🔥 Canonical + Language
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
    },
  },

  // 🔥 Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "Full Stack Developer | Next.js, Node.js, AI, Microservices",
    description:
      "Portfolio of Rahul Kumar: full stack developer building scalable web applications with Next.js, Node.js, AI, and microservices.",
    url: siteUrl,
    siteName: "Rahul Kumar Portfolio",
    images: [
      {
        url: `${siteUrl}/og_image.png`, // MUST be absolute
        width: 1200,
        height: 630,
        alt: "Rahul Kumar Portfolio",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  // 🔥 Twitter SEO
  twitter: {
    card: "summary_large_image",
    title: "Full Stack Developer | Next.js, Node.js, AI, Microservices",
    description:
      "Rahul Kumar builds scalable web apps with Next.js, Node.js, AI, and microservices. Explore projects, case studies, and the blog.",
    images: [`${siteUrl}/og_image.png`], // FIXED
  },

  // 🔥 Robots (Indexing Control)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 🔥 Icons (Favicon)
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon_io/favicon.ico"],
  },

  // 🔥 PWA Manifest
  manifest: "/favicon_io/site.webmanifest",
};
