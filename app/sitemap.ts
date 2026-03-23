/**
 * Generate dynamic sitemap
 */
import { listPortfolioItems } from "@/repositories/portfolio-repository"
import { siteUrl } from "@/utils/meta-data"
export default async function sitemap() {
  const projects = await listPortfolioItems("projects")

  const projectUrls = projects
    .map((project: any) => {
      const slug = project?.slug || project?.id
      if (!slug) return null
      return {
        url: `${siteUrl}/projects/${slug}`,
        lastModified: project?.updatedAt || project?.createdAt || new Date()
      }
    })
    .filter(Boolean) as { url: string; lastModified: Date }[]

  return [
    {
      url: siteUrl,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/assets`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/github`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/experience`,
      lastModified: new Date()
    },
    ...projectUrls
  ]
}
