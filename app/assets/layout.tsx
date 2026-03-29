import { buildPageMetadata } from "@/utils/meta-data";

export const metadata = buildPageMetadata({
  title: "Assets Library | Portfolio Resources",
  description:
    "Browse downloadable design and project assets, visuals, and resources from Rahul Kumar's portfolio.",
  path: "/assets",
  keywords: ["Portfolio Assets", "Design Resources", "Downloads", "Project Assets"],
});

export default function AssetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
