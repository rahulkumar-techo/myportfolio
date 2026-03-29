/**
 * High-performance SEO metadata for Rahul Kumar Portfolio
 * Optimized for Google ranking, social sharing, and recruiter visibility
 */

import type { Metadata } from "next";

export const siteUrl = "https://rahulkumardev.vercel.app";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const canonical = `${siteUrl}${normalizedPath}`;
  const imageUrl = image ?? `${siteUrl}/og_image.png`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // 🔥 Title Optimization (SEO + CTR)
  title: {
    default:
      "Full Stack Developer | Next.js Developer | Node.js Developer | AI Developer Portfolio",
    template: "%s | Rahul Kumar",
  },

  // 🔥 Strong Description (Google + Recruiters)
  description:
    "Rahul Kumar is a Full Stack Developer, Next.js Developer, and Node.js Developer - an AI Developer Portfolio with projects, case studies, skills, and contact.",

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
    "Full Stack Developer",
    "Full Stack Developer India",
    "Next.js Developer",
    "Node.js Developer",
    "AI Developer Portfolio",
    "React Developer",
    "AI Developer",
    "AI Engineer",
    "AI Web Developer",
    "Microservices Developer",
    "Software Engineer Portfolio",
    "Web Developer Portfolio",
    "Next.js App Router",
    "TypeScript Developer",
    "Portfolio Website",
  ],

  // 🔥 Language
  alternates: {
    languages: {
      "en-US": siteUrl,
    },
  },

  // 🔥 Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "Full Stack Developer | Next.js Developer | Node.js Developer | AI Developer Portfolio",
    description:
      "Full Stack Developer portfolio with Next.js, Node.js, and AI projects, case studies, and skills.",
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
    title: "Full Stack Developer | Next.js Developer | Node.js Developer | AI Developer Portfolio",
    description:
      "Full Stack Developer portfolio with Next.js, Node.js, and AI work. Explore projects, case studies, and the blog.",
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
