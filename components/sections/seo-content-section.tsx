import Link from 'next/link';

const sections = [
  {
    id: 'about-detailed',
    title: 'About Me',
    lead: 'A detailed overview of how I approach full stack development, SEO, and product strategy.',
    paragraphs: [
      'Hi, I am Rahul Kumar, a Full Stack Developer focused on building fast, reliable web products that feel great and rank well. As a Next.js Developer and Node.js Developer, I build end to end experiences, from visual design systems to APIs, data models, and deployment pipelines. This AI Developer Portfolio highlights the way I translate business goals into measurable outcomes: higher conversion, stronger search visibility, and faster time to value. I work with modern tooling, but I keep the fundamentals sharp: semantic HTML, accessible UI, and a clear information hierarchy that helps both users and search engines understand the story behind each project.',
      'I partner with founders, agencies, and product teams to ship revenue generating sites and internal tools. As a Full Stack Developer, I can handle discovery, UX wireframes, API modeling, database design, and deployment. If you already have a design system, I can extend it; if not, I can define tokens, type scales, and reusable components. I also help prioritize content so the most important queries are addressed early on the page, creating a clear hierarchy for Google SEO.',
      'My approach blends product strategy with engineering discipline. I start by defining the audience, the search intent, and the user journey, then I map those needs to the structure of the site. For performance, I optimize loading paths, reduce layout shift, and use code splitting so every page feels instant. For SEO, I focus on on page quality, natural language, and trustworthy signals like structured data, internal linking, and well scoped metadata. The result is not just a beautiful interface, but a stable, production ready platform that scales.',
      'For content quality, I avoid fluff and focus on clear, specific language. I treat every page as a narrative: what the user wants, how the product helps, and why the implementation is trustworthy. That is why you will see precise explanations of technologies, constraints, and results throughout this AI Developer Portfolio. Search engines reward clarity and depth, and so do decision makers reading the site. This approach improves time on page, reduces bounce, and builds confidence.',
    ],
  },
  {
    id: 'skills-explained',
    title: 'Skills Explained',
    lead: 'A practical breakdown of the tools and methods behind my Next.js and Node.js work.',
    paragraphs: [
      'On the frontend, I specialize in Next.js App Router, React, TypeScript, and Tailwind CSS. That stack lets me build component systems that are flexible and fast, with clean accessibility and responsive behavior across devices. I treat performance as a feature: optimized images, deferred loading for heavy components, and precise control over rendering. As a Next.js Developer, I also use the framework metadata APIs, route conventions, and caching strategies to make content discoverable, durable, and easy to maintain.',
      'On the backend, I design APIs with Node.js, integrate databases like PostgreSQL and Redis, and ship server side logic that stays secure under real world traffic. I love building AI features that are practical, not just flashy: recommendation engines, content assistants, analytics summarization, and workflow automation. This is where the AI Developer Portfolio comes alive, with thoughtful use of embeddings, search, and inference pipelines that improve user experience without slowing the site. As a Node.js Developer, I prioritize observability, error handling, and clear data contracts so teams can iterate safely.',
      'On the tooling side, I use GitHub for version control, CI pipelines for automated checks, and monitoring to catch regressions quickly. I add structured data when it improves understanding, and I keep markup semantic so screen readers and crawlers can parse the page. I also focus on security basics: safe input handling, protected API routes, and minimal exposure of sensitive data like contact emails.',
    ],
  },
  {
    id: 'projects-case-studies',
    title: 'Projects and Case Studies',
    lead: 'Clear, SEO friendly case studies that show the problem, solution, and business impact.',
    paragraphs: [
      'Each project in this portfolio follows a case study structure that mirrors how clients think. I outline the Problem, present the Solution, list the Tech Stack, and explain the Impact. This format gives readers a quick way to evaluate fit, and it gives search engines a clean semantic path through the content. You will see projects that combine Next.js, Node.js, and AI, along with examples that highlight data visualization, real time collaboration, and performance focused UX.',
      'In every case study, I document decisions, not just outcomes. I explain why a particular framework was chosen, how the information architecture supports SEO, and where performance improvements made the biggest difference. The goal is to show the craft behind the work: code quality, thoughtful design, and business results. If you are hiring a Full Stack Developer, you can scan these sections and quickly understand how I reduce risk, speed up delivery, and improve user engagement.',
      'If you are comparing candidates, consider the outcomes I optimize for: stable builds, consistent Lighthouse scores, and content that ranks for competitive terms like Next.js Developer and Node.js Developer. I am not just shipping pages; I am shipping a portfolio that works as a lead generation engine. You can explore the project list, read the blog, and see how each decision supports discoverability and conversion.',
    ],
  },
  {
    id: 'technical-seo',
    title: 'Technical SEO and Production Readiness',
    lead: 'The behind the scenes work that turns a portfolio into a reliable growth channel.',
    paragraphs: [
      'My delivery process is built for production readiness. I plan URL structures early, write content in a way that matches search intent, and use internal linking to guide both users and crawlers to the most important pages. I review Core Web Vitals, compress media, and use lazy loading to keep pages fast. I also validate metadata, canonical URLs, and structured data so the site presents a consistent, trustworthy identity across platforms. That means better performance, stronger rankings, and more qualified traffic.',
      'For technical SEO, I create content clusters around core services and link them together. The homepage introduces the primary topics, while project pages and blog articles go deeper into specific problems, giving Google clear topical relevance. I keep URLs short and consistent, avoid duplicate content with canonical tags, and ensure every image has meaningful alt text. The goal is simple: a developer portfolio that is easy to crawl and even easier to trust.',
    ],
  },
  {
    id: 'cta',
    title: 'Call to Action',
    lead: 'Ready to build? Here are the fastest ways to explore or start a conversation.',
    paragraphs: [
      'If you want a partner who can move from strategy to implementation, I would love to help. Whether you need a marketing site, a SaaS dashboard, or an AI product, we can design the right architecture and ship it with confidence. Explore the case studies, browse the blog, and reach out through the contact page when you are ready to build.',
    ],
  },
];

const ctaLinks = [
  { href: '/projects', label: 'Explore Projects' },
  { href: '/case-studies', label: 'Read Case Studies' },
  { href: '/blog', label: 'Developer Blog' },
  { href: '/contact', label: 'Start a Project' },
];

export default function SeoContentSection() {
  return (
    <section id="seo-content" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-20 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-primary">PORTFOLIO STORY</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Detailed Content for <span className="text-primary">SEO and Discoverability</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A long form narrative built for readers, recruiters, and search engines. This section adds depth, clarity, and keyword relevance.
          </p>
        </header>

        <div className="mx-auto max-w-4xl space-y-12">
          {sections.map((section) => (
            <article key={section.id} className="glass-card rounded-2xl p-6 md:p-8">
              <h3 id={section.id} className="text-2xl font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{section.lead}</p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.id === 'cta' ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {ctaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-primary/20 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary hover:bg-primary/10"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
