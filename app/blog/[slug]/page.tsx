import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { listPortfolioItems } from "@/repositories/portfolio-repository";
import { normalizeBlogPosts } from "@/lib/blog";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { siteUrl } from "@/utils/meta-data";

export const revalidate = 60;

async function fetchBlogs() {
  const raw = await listPortfolioItems("blogs");
  return normalizeBlogPosts(raw);
}

async function getBlogBySlug(slug: string) {
  const posts = await fetchBlogs();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return { title: "Blog Post Not Found | Rahul Kumar" };
  }

  const ogImage = post.coverImage?.url
    ? post.coverImage.url.startsWith("http")
      ? post.coverImage.url
      : `${siteUrl}${post.coverImage.url.startsWith("/") ? "" : "/"}${post.coverImage.url}`
    : `${siteUrl}/og_image.png`;

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = renderMarkdownToHtml(post.content);
  const relatedPosts = (await fetchBlogs())
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const imageUrl = post.coverImage?.url
    ? post.coverImage.url.startsWith("http")
      ? post.coverImage.url
      : `${siteUrl}${post.coverImage.url}`
    : `${siteUrl}/og_image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
    },
    image: imageUrl,
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10">
                <Image
                  src={post.coverImage?.url ?? "/og_image.png"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  • {post.readingTime}
                </p>
                <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                  {post.title}
                </h1>
                <p className="mt-3 text-muted-foreground">{post.description}</p>
                <div className="mt-6 rich-text" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Explore More</h2>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <Link className="hover:text-primary transition-colors" href="/projects">Projects</Link>
                  <Link className="hover:text-primary transition-colors" href="/case-studies">Case Studies</Link>
                  <Link className="hover:text-primary transition-colors" href="/#skills">Skills</Link>
                  <Link className="hover:text-primary transition-colors" href="/contact">Start a Project</Link>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">More Posts</h3>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
