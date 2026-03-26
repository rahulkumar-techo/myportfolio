export default function BlogDetailLoading() {
  return (
    <main className="min-h-screen">
      <section className="relative pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="h-4 w-24 rounded-full bg-secondary" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="h-64 bg-secondary/60" />
              <div className="p-8 space-y-4">
                <div className="h-3 w-36 rounded-full bg-secondary" />
                <div className="h-8 w-3/4 rounded-full bg-secondary" />
                <div className="h-4 w-full rounded-full bg-secondary" />
                <div className="h-4 w-2/3 rounded-full bg-secondary" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="h-4 w-28 rounded-full bg-secondary" />
                <div className="h-3 w-full rounded-full bg-secondary" />
                <div className="h-3 w-2/3 rounded-full bg-secondary" />
              </div>
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="h-4 w-28 rounded-full bg-secondary" />
                <div className="h-3 w-full rounded-full bg-secondary" />
                <div className="h-3 w-2/3 rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
