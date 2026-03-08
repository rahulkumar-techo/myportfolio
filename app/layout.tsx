import type { Metadata, Viewport } from 'next'
import { Roboto, Orbitron, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from '@/components/provider/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rahul kumar',
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
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon_io/favicon.ico'],
  },
  manifest: '/favicon_io/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${orbitron.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
