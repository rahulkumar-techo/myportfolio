/**
 * Global SEO metadata for portfolio
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://rahulkumardev.vercel.app"),

  title: {
    default: "Rahul Kumar | Full Stack Developer",
    template: "%s | Rahul Kumar Portfolio",
  },

  description:
    "Rahul Kumar is a Full Stack Developer specializing in Next.js, Node.js, Microservices and AI powered applications.",

    verification:{google:"_QNLV10mzA4nAID8UI4QvIrm0l1lhA_LRLgAZqmO7ak"},

  keywords: [
    "Rahul Kumar",
    "Rahul Kumar Developer",
    "Full Stack Developer",
    "Next.js Developer",
    "Portfolio",
    "Node.js Developer",
  ],

  alternates: {
    canonical: "https://rahulkumardev.vercel.app",
  },

  openGraph: {
    title: "Rahul Kumar | Full Stack Developer",
    description:
      "Portfolio of Rahul Kumar – Full Stack Developer specializing in Next.js and AI applications.",
    url: "https://rahulkumardev.vercel.app",
    siteName: "Rahul Kumar Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rahul Kumar Portfolio",
    description:
      "Full Stack Developer building scalable web applications with Next.js and Node.js",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon_io/favicon.ico'],
  },
  manifest: '/favicon_io/site.webmanifest',
};