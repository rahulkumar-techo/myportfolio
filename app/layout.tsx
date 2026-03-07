import type { Metadata, Viewport } from 'next'
import { Orbitron, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from '@/components/provider/auth-provider';
import ThemeSettingsSync from '@/components/provider/theme-settings-sync';
import { ThemeProvider } from '@/components/theme-provider';
import { getPublicSiteSettings } from '@/repositories/user-repository';

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Futuristic Developer Portfolio | 3D Interactive Experience',
  description: 'A high-tech futuristic developer portfolio with 3D scenes, AI assistant guide, and immersive holographic UI. Built with Next.js, React Three Fiber, and cutting-edge web technologies.',
  keywords: ['developer', 'portfolio', '3D', 'futuristic', 'react', 'nextjs', 'three.js'],
  authors: [{ name: 'Developer' }],
  generator: 'v0.app',
  openGraph: {
    title: 'Futuristic Developer Portfolio',
    description: 'An immersive 3D portfolio experience',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Futuristic Developer Portfolio',
    description: 'An immersive 3D portfolio experience',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getPublicSiteSettings()
  const themeClass = settings.theme === 'dark' ? 'dark' : undefined
  const defaultTheme = settings.theme === 'system' ? 'system' : settings.theme

  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <body className={`${orbitron.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
          <AuthProvider>
            <ThemeSettingsSync />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
