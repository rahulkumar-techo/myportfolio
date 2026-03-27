import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Case Studies | Rahul Kumar",
  description:
    "Featured case studies showcasing Next.js, Node.js, AI, and microservices projects with results and architecture.",
  keywords: [
    "Case Studies",
    "Next.js Projects",
    "Node.js Projects",
    "AI Projects",
    "Full Stack Developer Case Studies",
    "Rahul Kumar",
  ],
  alternates: {
    canonical: `${siteUrl}/case-studies`,
  },
  openGraph: {
    title: "Case Studies | Rahul Kumar",
    description:
      "Featured case studies showcasing Next.js, Node.js, AI, and microservices projects.",
    url: `${siteUrl}/case-studies`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Case studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Rahul Kumar",
    description:
      "Featured case studies showcasing Next.js, Node.js, AI, and microservices projects.",
    images: [`${siteUrl}/og_image.png`],
  },
};
