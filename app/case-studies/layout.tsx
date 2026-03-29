import { buildPageMetadata } from "@/utils/meta-data";

export const metadata = buildPageMetadata({
  title: "Case Studies | Product and Engineering Work",
  description:
    "Deep dives into product strategy, engineering decisions, and outcomes across Rahul Kumar's projects.",
  path: "/case-studies",
  keywords: ["Case Studies", "Product Strategy", "Engineering", "Project Results"],
});

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
