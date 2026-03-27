import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Contact | Rahul Kumar",
  description:
    "Start a project with Rahul Kumar. Get in touch for Next.js, Node.js, AI, and microservices development.",
  keywords: [
    "Contact Full Stack Developer",
    "Hire Next.js Developer",
    "Node.js Developer Contact",
    "AI Developer Portfolio",
    "Rahul Kumar",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact | Rahul Kumar",
    description:
      "Start a project with Rahul Kumar. Get in touch for Next.js, Node.js, AI, and microservices development.",
    url: `${siteUrl}/contact`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Contact Rahul Kumar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Rahul Kumar",
    description:
      "Start a project with Rahul Kumar. Get in touch for Next.js, Node.js, AI, and microservices development.",
    images: [`${siteUrl}/og_image.png`],
  },
};
