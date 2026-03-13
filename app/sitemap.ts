/**
 * Generate dynamic sitemap
 */
import { connectDB } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import { siteUrl } from "@/utils/meta-data";
export default async function sitemap() {

  await connectDB();

  const user = await UserModel.findOne({
    email: "mrrhl02@gmail.com",
    role: "admin",
  });

  const projects = (user?.projects ?? []) as any[];

  const projectUrls = projects
    .map((project: any) => {
      const slug = project?.slug || project?.id;
      if (!slug) return null;
      return {
        url: `${siteUrl}/projects/${slug}`,
        lastModified: project?.updatedAt || project?.createdAt || new Date(),
      };
    })
    .filter(Boolean) as { url: string; lastModified: Date }[];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/assets`,
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}
