import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ContactSection from '@/components/sections/contact-section'
import ManageNotifications from '@/components/notifications/manage-notifications'
import PublicSWRProvider from '@/components/public-swr-provider'
import { getPublicProfileData, serializeForClient } from '@/lib/public-data'

export const revalidate = 60

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
