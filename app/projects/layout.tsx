import { buildPageMetadata } from "@/utils/meta-data";

export const metadata = buildPageMetadata({
  title: "Projects | Full Stack Case Studies",
  description:
    "Explore Rahul Kumar's full stack projects, including Next.js, Node.js, and AI-driven product case studies.",
  path: "/projects",
  keywords: ["Projects", "Case Studies", "Next.js Projects", "AI Projects", "Portfolio"],
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
