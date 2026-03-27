/**
 * Generate dynamic sitemap
 */
import { listPortfolioItems } from "@/repositories/portfolio-repository"
import { siteUrl } from "@/utils/meta-data"
import { normalizeBlogPosts } from "@/lib/blog"
export default async function sitemap() {
  const projects = await listPortfolioItems("projects")
  const posts = normalizeBlogPosts(await listPortfolioItems("blogs"))

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
      url: `${siteUrl}/about`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/case-studies`,
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
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date()
    },
    ...projectUrls,
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt ?? post.createdAt)
    }))
  ]
}
