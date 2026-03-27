import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Projects & Case Studies | Rahul Kumar",
  description:
    "Case studies and projects in Next.js, Node.js, AI, and microservices. Explore architecture, results, and live demos.",
  keywords: [
    "Full Stack Developer Projects",
    "Next.js Projects",
    "Node.js Projects",
    "AI Projects",
    "Case Studies",
    "Rahul Kumar",
  ],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    title: "Projects & Case Studies | Rahul Kumar",
    description:
      "Case studies and projects in Next.js, Node.js, AI, and microservices.",
    url: `${siteUrl}/projects`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Projects and Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Case Studies | Rahul Kumar",
    description:
      "Case studies and projects in Next.js, Node.js, AI, and microservices.",
    images: [`${siteUrl}/og_image.png`],
  },
};
