export const portfolioContent = {
  hero: {
    status: "Open to full-time roles, freelance builds, and startup teams",
    titleLead: "Full-stack engineer for",
    titleAccent: "AI products and scalable web systems",
    description:
      "I build AI-powered apps, microservice-ready backends, and mobile-first interfaces that automate workflows, deliver real-time updates, and hold up in production.",
    chips: ["AI apps", "Microservices", "Notification systems", "Document pipelines"],
  },
  about: {
    eyebrow: "ABOUT",
    title: "What I build",
    intro:
      "I build web products where the interface, backend, and automation layer work as one system. That includes AI-powered apps, admin platforms, content systems, and APIs designed for real usage, not just polished screenshots.",
    supporting:
      "Most of my work sits where product needs meet engineering constraints: replacing manual workflows with AI-assisted flows, shaping apps into clean service boundaries, and building mobile-first experiences that stay usable under real conditions.",
    problems: [
      "Turn repetitive manual work into AI-assisted flows with structured outputs and human review points.",
      "Design backend systems that can grow from a single app into service-based architecture without a rewrite.",
      "Build responsive publishing, dashboard, and notification interfaces that stay fast on mobile.",
      "Connect product features to the systems behind them: auth, storage, APIs, delivery, and observability.",
    ],
    examples: [
      {
        title: "AI-powered apps",
        description:
          "I use AI where it removes operational drag: document extraction, summarization, classification, and workflow automation.",
      },
      {
        title: "Microservices architecture",
        description:
          "I break growing products into cleaner service boundaries so content, notifications, and business logic can scale independently.",
      },
      {
        title: "Mobile-first execution",
        description:
          "I design for small screens first, then expand the system without sacrificing speed, clarity, or conversion paths.",
      },
    ],
  },
  projects: [
    {
      name: "Content Platform with Notification Workflow",
      problem:
        "Static websites become outdated quickly and give visitors no reason to return after the first visit.",
      solution:
        "Built a full-stack content platform with an admin dashboard, MongoDB-backed APIs, asset management, and a publish flow that triggers in-app feed updates, email delivery, and browser push notifications.",
      keyFeatures: [
        "Admin CRUD for projects, blogs, skills, assets, and experience",
        "Verified email subscription flow with preference management",
        "Browser push notifications and on-site notification center",
        "SEO-ready public pages with dynamic case-study routing",
      ],
      tech: [
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Mongoose",
        "Tailwind CSS",
        "NextAuth",
        "Firebase Cloud Messaging",
        "Cloudinary",
      ],
      highlights: [
        "Separated UI, API, repository, and model layers for maintainability",
        "Publish-event fan-out to feed logging, email delivery, and push delivery",
        "Cached MongoDB connection strategy for reliable serverless execution",
      ],
      impact:
        "Turned a static portfolio into a reusable product platform that is easier to update, easier to scale, and better at re-engaging visitors after new content goes live.",
    },
    {
      name: "CodeForge AI Review Pipeline",
      problem:
        "Manual code review slows releases, creates inconsistent feedback, and makes it harder to catch risky changes early.",
      solution:
        "Built an AI-assisted review service that analyzes pull request diffs, generates structured feedback, and flags issues before human review starts.",
      keyFeatures: [
        "Pull request diff ingestion and structured review summaries",
        "Rule-based checks combined with LLM-generated feedback",
        "Async processing for large repositories and bigger PRs",
        "Reviewer-facing output focused on risk, clarity, and next actions",
      ],
      tech: ["Node.js", "FastAPI", "OpenAI", "TypeScript", "Python", "Docker", "Redis", "GitHub API"],
      highlights: [
        "Split request handling from async workers to keep response times predictable",
        "Added schema-validated outputs to reduce vague AI responses",
        "Used retries and caching to stabilize model calls and repository analysis",
      ],
      impact:
        "Reduced review turnaround, improved consistency, and helped surface risky changes earlier in the delivery cycle.",
    },
    {
      name: "DocFlow AI",
      problem:
        "Teams handling invoices, forms, resumes, or internal documents lose time to manual extraction and inconsistent formats.",
      solution:
        "Built an OCR-to-LLM pipeline that converts uploaded documents into structured data, review-ready summaries, and exportable outputs.",
      keyFeatures: [
        "File upload and secure document storage",
        "OCR extraction followed by LLM-based field mapping",
        "Confidence scoring with human review fallback",
        "Exportable results for dashboards, CSVs, or downstream APIs",
      ],
      tech: ["Next.js", "Node.js", "TypeScript", "MongoDB", "OCR services", "OpenAI", "Queue workers"],
      highlights: [
        "Designed a multi-step async pipeline from upload to validated output",
        "Added retry-safe job handling for partial failures and reprocessing",
        "Stored raw files, extracted text, and final output separately for traceability",
      ],
      impact:
        "Cut manual processing time, improved consistency across document types, and made unstructured inputs usable inside real business workflows.",
    },
  ],
  engineering: {
    eyebrow: "ENGINEERING",
    title: "System design that supports product growth",
    intro:
      "I focus on the systems behind the screen: workflow design, delivery infrastructure, backend boundaries, and operational reliability.",
    pillars: [
      {
        title: "Event-driven workflows",
        description:
          "I use event-style publish and processing flows so user or admin actions can trigger downstream jobs without coupling everything to one request.",
        points: ["Publish action -> feed entry", "Background fan-out for downstream work", "Loose coupling between product features"],
      },
      {
        title: "Notification systems",
        description:
          "I build notification flows that support email and browser push, with verification, preference controls, token cleanup, and delivery logging.",
        points: ["Email confirmation and unsubscribe flows", "Push token registration and cleanup", "Preference-aware delivery paths"],
      },
      {
        title: "AI pipelines",
        description:
          "I design AI workflows as multi-step systems: OCR, normalization, LLM processing, validation, and output generation with fallback paths.",
        points: ["OCR -> structured text", "LLM -> validated fields", "Human review for low-confidence cases"],
      },
      {
        title: "Scalable backend architecture",
        description:
          "I separate public APIs, admin operations, repositories, and persistent models so the codebase stays easier to test, extend, and debug.",
        points: ["Clear route boundaries", "Repository-driven data access", "Shared services for cross-cutting workflows"],
      },
      {
        title: "Caching and queues",
        description:
          "I use caching and async workers for expensive operations like notifications, AI jobs, media processing, and content fan-out.",
        points: ["Cached DB connections", "Async delivery and retries", "Job-friendly architecture for heavier tasks"],
      },
    ],
  },
  skills: {
    eyebrow: "SKILLS",
    title: "Skills grouped by the work they support",
    intro:
      "I use tools based on the problem they solve. The stack matters, but the reason each part exists matters more.",
    groups: [
      {
        title: "Frontend",
        subtitle: "User experience",
        description:
          "I build mobile-first interfaces that load fast, communicate clearly, and make complex workflows feel simple.",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Responsive UI", "Accessibility"],
      },
      {
        title: "Backend",
        subtitle: "Scalability",
        description:
          "I design APIs and service boundaries that stay maintainable as features grow and can evolve into microservice-friendly systems.",
        items: ["Node.js", "Next.js API routes", "MongoDB", "Mongoose", "REST APIs", "Authentication"],
      },
      {
        title: "AI",
        subtitle: "Automation",
        description:
          "I use AI where it removes manual work or speeds up decisions, not as a novelty layer.",
        items: ["OpenAI APIs", "Prompt design", "Structured outputs", "OCR workflows", "Classification", "Summarization"],
      },
      {
        title: "DevOps",
        subtitle: "Deployment",
        description:
          "I ship with production concerns in mind: deployment, media delivery, environment management, and operational reliability.",
        items: ["Vercel", "Docker", "CI/CD", "Firebase", "Cloudinary", "Performance optimization"],
      },
    ],
  },
  cta: {
    eyebrow: "LET'S BUILD",
    title: "Open to opportunities where the product and system both matter",
    description:
      "I am open to full-stack roles, startup teams, and contract work focused on real products and real users. If you need someone who can build the interface, design the backend, and ship the automation behind it, let's talk.",
  },
} as const;
