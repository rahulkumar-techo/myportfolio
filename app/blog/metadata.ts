import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Developer Blog | Rahul Kumar",
  description:
    "Insights on Next.js, Node.js, AI, and microservices. Tutorials, case studies, and practical engineering advice.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Developer Blog | Rahul Kumar",
    description:
      "Next.js, Node.js, AI, and microservices articles from Rahul Kumar.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Rahul Kumar Developer Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Blog | Rahul Kumar",
    description:
      "Next.js, Node.js, AI, and microservices articles from Rahul Kumar.",
    images: [`${siteUrl}/og_image.png`],
  },
};
