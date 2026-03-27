import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import AboutSection from '@/components/sections/about-section';
import SeoContentSection from '@/components/sections/seo-content-section';
import TypingText from '@/components/typing-text';
import Link from 'next/link';

export const revalidate = 60;

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-primary tracking-[0.3em]">ABOUT</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold">
              <span className="text-foreground">Full Stack Developer with a focus on </span>
              <span className="text-primary">
                <TypingText text="Next.js, Node.js, and AI" speed={40} delay={200} loop pause={1800} />
              </span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A detailed look at my background, workflows, and the principles behind this AI Developer Portfolio.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <Link className="hover:text-primary transition-colors" href="/projects">Projects</Link>
              <Link className="hover:text-primary transition-colors" href="/case-studies">Case Studies</Link>
              <Link className="hover:text-primary transition-colors" href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <div className="content-visibility-auto">
        <SeoContentSection />
      </div>

      <Footer />
    </main>
  );
}
