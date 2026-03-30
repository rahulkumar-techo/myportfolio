/**
 * Root layout with optimized SEO, fonts, and structured data
 */

import type { Viewport } from 'next'
import { Roboto, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from '@/components/provider/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { siteUrl } from "@/utils/meta-data"
import NotificationPrompt from "@/components/notifications/notification-prompt"

export { metadata } from "@/utils/meta-data"

// ✅ Font optimization (already good)
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ✅ Viewport config
export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

// 🔥 Improved JSON-LD (Person + Website)
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Rahul Kumar",
    url: siteUrl,
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Developer specializing in Next.js, Node.js, and AI applications",
    image: `${siteUrl}/og_image.png`,
    sameAs: [
      "https://github.com/rahulkumar-techo",
      "https://linkedin.com/in/rahul",
      "https://instagram.com/mr_rpraja",
    ],
    knowsAbout: [
      "Next.js",
      "Node.js",
      "React",
      "AI",
      "Microservices",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Rahul Kumar Portfolio",
    url: siteUrl,
    description:
      "Portfolio and blog of Rahul Kumar, full stack developer specializing in Next.js, Node.js, AI, and microservices.",
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      {/* ✅ Move structured data to HEAD (IMPORTANT) */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body
        suppressHydrationWarning
        className={`${roboto.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <NotificationPrompt />
            <Toaster closeButton richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}
