import type { Metadata } from 'next';
import { siteUrl } from '@/utils/meta-data';

export const metadata: Metadata = {
  title: 'About Rahul Kumar | Full Stack Developer',
  description:
    'Learn about Rahul Kumar, a Full Stack Developer, Next.js Developer, and Node.js Developer building SEO-ready web apps and AI products.',
  keywords: [
    'Rahul Kumar',
    'Full Stack Developer',
    'Next.js Developer',
    'Node.js Developer',
    'AI Developer Portfolio',
    'Developer Bio',
    'Software Engineer Portfolio',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Rahul Kumar | Full Stack Developer',
    description:
      'About the Full Stack Developer behind this Next.js, Node.js, and AI Developer Portfolio.',
    url: `${siteUrl}/about`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: 'About Rahul Kumar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Rahul Kumar | Full Stack Developer',
    description:
      'About the Full Stack Developer behind this Next.js, Node.js, and AI Developer Portfolio.',
    images: [`${siteUrl}/og_image.png`],
  },
};
