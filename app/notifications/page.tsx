import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { listNotificationFeedEntries } from "@/repositories/notification-repository";

export const revalidate = 60;

const typeLabels: Record<string, string> = {
  project: "Project",
  blog: "Blog",
  asset: "Asset"
};

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

export default async function NotificationsPage() {
  const entries = await listNotificationFeedEntries(50);

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-primary tracking-[0.3em]">UPDATES</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold">
              Notification <span className="text-primary">Feed</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Stay in the loop with every project, blog, and asset update shared with subscribers.
            </p>
          </div>

          {entries.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
              No notifications yet. New updates will appear here once they go live.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => {
                const href = entry.url?.trim();
                const isExternal = Boolean(href && /^https?:\/\//i.test(href));
                const CardContent = (
                  <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        {typeLabels[entry.type] ?? "Update"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-foreground">
                      {entry.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {entry.description}
                    </p>
                    {href ? (
                      <span className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-primary">
                        View details
                      </span>
                    ) : null}
                  </div>
                );

                if (!href) {
                  return <div key={`${entry.title}-${index}`}>{CardContent}</div>;
                }

                if (isExternal) {
                  return (
                    <a
                      key={`${entry.title}-${index}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {CardContent}
                    </a>
                  );
                }

                return (
                  <Link key={`${entry.title}-${index}`} href={href} className="block">
                    {CardContent}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
