import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Experience | Rahul Kumar",
  description:
    "Full stack developer experience building scalable web apps with Next.js, Node.js, AI, and microservices.",
  alternates: {
    canonical: `${siteUrl}/experience`,
  },
  openGraph: {
    title: "Experience | Rahul Kumar",
    description:
      "Full stack developer experience building scalable web apps with Next.js, Node.js, AI, and microservices.",
    url: `${siteUrl}/experience`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Rahul Kumar experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience | Rahul Kumar",
    description:
      "Full stack developer experience building scalable web apps with Next.js, Node.js, AI, and microservices.",
    images: [`${siteUrl}/og_image.png`],
  },
};
