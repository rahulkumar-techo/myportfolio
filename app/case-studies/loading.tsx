export default function CaseStudiesLoading() {
  return (
    <main className="min-h-screen">
      <section className="relative pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="mx-auto h-4 w-28 rounded-full bg-secondary" />
            <div className="mt-4 h-10 w-full rounded-xl bg-secondary" />
            <div className="mt-3 h-4 w-2/3 rounded-full bg-secondary mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-card rounded-2xl overflow-hidden">
                <div className="h-56 bg-secondary/60" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 rounded-full bg-secondary" />
                  <div className="h-4 w-full rounded-full bg-secondary" />
                  <div className="h-4 w-3/4 rounded-full bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
