import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ContactSection from '@/components/sections/contact-section'
import ManageNotifications from '@/components/notifications/manage-notifications'
import PublicSWRProvider from '@/components/public-swr-provider'
import { getPublicProfileData, serializeForClient } from '@/lib/public-data'
import { buildPageMetadata } from '@/utils/meta-data'

export const revalidate = 60

export const metadata = buildPageMetadata({
  title: 'Contact Rahul Kumar | Start a Project',
  description:
    'Get in touch to discuss full stack development, Next.js, Node.js, and AI-driven product work.',
  path: '/contact',
  keywords: [
    'Contact Rahul Kumar',
    'Hire Full Stack Developer',
    'Next.js Freelancer',
    'AI Developer',
  ],
})

export default async function ContactPage() {
  const profile = await getPublicProfileData()
  const fallback = serializeForClient({
    '/settings': { success: true, data: profile.settings },
    '/public/profile': { success: true, data: profile }
  })

  return (
    <PublicSWRProvider fallback={fallback}>
      <main className="relative">
        <Navigation />
        <ContactSection />
        <ManageNotifications />
        <Footer />
      </main>
    </PublicSWRProvider>
  )
}
