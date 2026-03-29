import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { listNotificationFeedEntries } from "@/repositories/notification-repository";
import NotificationFeed from "@/components/notifications/notification-feed";

export const revalidate = 60;

export default async function NotificationsPage() {
  const entries = await listNotificationFeedEntries(50);
  const serializedEntries = entries.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : String(entry.createdAt)
  }));

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[140px]" />

        <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-mono tracking-[0.3em] text-primary">UPDATES</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl md:text-6xl">
              Notification <span className="text-primary">Center</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              A polished, real-time feed of everything new across projects, blogs, and assets.
            </p>
          </div>

          <NotificationFeed entries={serializedEntries} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
