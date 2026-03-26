import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { listPortfolioItems } from "@/repositories/portfolio-repository";
import { normalizeBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export default async function BlogPage() {
  const rawPosts = await listPortfolioItems("blogs");
  const posts = normalizeBlogPosts(rawPosts);

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-primary tracking-[0.3em]">INSIGHTS</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold">
              Developer Blog on <span className="text-primary">Next.js, Node.js & AI</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Practical guides, case studies, and performance-focused engineering notes.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <Link className="hover:text-primary transition-colors" href="/projects">Projects</Link>
              <Link className="hover:text-primary transition-colors" href="/case-studies">Case Studies</Link>
              <Link className="hover:text-primary transition-colors" href="/#skills">Skills</Link>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
              No blog posts yet. Add your first post from the admin panel.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <Image
                      src={post.coverImage?.url ?? "/og_image.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">{post.readingTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { href: "/projects", label: "Explore Projects" },
              { href: "/case-studies", label: "Read Case Studies" },
              { href: "/contact", label: "Start a Project" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card rounded-2xl p-5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
