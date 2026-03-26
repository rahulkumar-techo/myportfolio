export default function BlogLoading() {
  return (
    <main className="min-h-screen">
      <section className="relative pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mx-auto h-4 w-32 rounded-full bg-secondary" />
            <div className="mt-4 h-10 w-full rounded-xl bg-secondary" />
            <div className="mt-3 h-4 w-2/3 rounded-full bg-secondary mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-card rounded-2xl overflow-hidden">
                <div className="h-44 bg-secondary/60" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 rounded-full bg-secondary" />
                  <div className="h-6 w-3/4 rounded-full bg-secondary" />
                  <div className="h-4 w-full rounded-full bg-secondary" />
                  <div className="h-4 w-2/3 rounded-full bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
