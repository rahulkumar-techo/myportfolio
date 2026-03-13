/**
 * Global SEO metadata for portfolio
 */

import type { Metadata } from "next";

export const siteUrl = "https://rahulkumar.dev";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: "Rahul Kumar | Full Stack Developer",
        template: "%s | Rahul Kumar Portfolio",
    },

    description:
        "Rahul Kumar is a Full Stack Developer specializing in Next.js, Node.js, Microservices and AI powered applications.",

    applicationName: "Rahul Kumar Portfolio",
    authors: [{ name: "Rahul Kumar", url: siteUrl }],
    creator: "Rahul Kumar",
    publisher: "Rahul Kumar",
    category: "Technology",
    referrer: "origin-when-cross-origin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    verification: { google: "_QNLV10mzA4nAID8UI4QvIrm0l1lhA_LRLgAZqmO7ak" },

    keywords: [
        "Rahul Kumar",
        "Rahul Kumar Developer",
        "Full Stack Developer",
        "Next.js Developer",
        "Portfolio",
        "Node.js Developer",
        "Rahul Kumar",
        "Rahul",
        "Rahul Kumar Developer",
        "Rahul Kumar Portfolio",
        "Rahul Kumar Full Stack Developer",
        "Rahul Kumar Next.js Developer",
        "Rahul Kumar Node.js Developer",
        "Rahul Kumar Software Engineer",
        "Rahul Kumar Web Developer",
        "Rahul Kumar India",
        "Rahul Kumar Programmer",
        "Rahul Kumar GitHub",
        "Rahul Kumar Projects",
        "Rahul Kumar AI Developer",
        "Rahul Kumar Tech",
        "Rahul Kumar Dev",
        "Rahul Kumar Website",
        "Rahul Kumar Portfolio Website",
        "Rahul Kumar React Developer",
        "Rahul Kumar Microservices Developer",
        "Rahul Kumar Backend Developer",
        "Rahul Kumar Frontend Developer",
        "Rahul Kumar Nextjs Portfolio",
        "Rahul Kumar Developer Portfolio",
        "Rahul Kumar Software Developer",
        "Developer Rahul Kumar",
        "Portfolio Rahul Kumar"
    ],

    alternates: {
        canonical: siteUrl,
    },

    openGraph: {
        title: "Rahul Kumar | Full Stack Developer",
        description:
            "Portfolio of Rahul Kumar – Full Stack Developer specializing in Next.js and AI applications.",
        url: siteUrl,
        siteName: "Rahul Kumar Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Rahul Kumar Portfolio",
            },
        ],
        type: "website",
        locale: "en_US",
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
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
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
