import type { Metadata } from "next";
import { siteUrl } from "@/utils/meta-data";

export const metadata: Metadata = {
  title: "Assets & Downloads | Rahul Kumar",
  description:
    "Downloadable assets, resources, and supporting materials from Rahul Kumar's portfolio.",
  keywords: [
    "Portfolio Assets",
    "Resume Download",
    "CV",
    "Certificates",
    "Developer Portfolio Resources",
    "Rahul Kumar",
  ],
  alternates: {
    canonical: `${siteUrl}/assets`,
  },
  openGraph: {
    title: "Assets & Downloads | Rahul Kumar",
    description:
      "Downloadable assets, resources, and supporting materials from Rahul Kumar's portfolio.",
    url: `${siteUrl}/assets`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Portfolio assets and downloads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assets & Downloads | Rahul Kumar",
    description:
      "Downloadable assets, resources, and supporting materials from Rahul Kumar's portfolio.",
    images: [`${siteUrl}/og_image.png`],
  },
};
