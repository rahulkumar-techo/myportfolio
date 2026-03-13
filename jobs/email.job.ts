/**
 * Email job processor
 */
import { sendProjectMail } from "@/services/email.service";

type EmailUser = {
  name: string;
  email: string;
  image?: string;
};

type EmailProject = {
  title: string;
  description: string;
  slug?: string;
  id?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processEmailJob(data: {
  users: EmailUser[];
  project: EmailProject;
  delayMs?: number;
}) {
  const { users, project, delayMs = 400 } = data || {};

  if (!users || !project) {
    throw new Error("Invalid email job payload");
  }

  console.log("Processing email job for project:", project.title);

  for (const user of users) {
    if (!user?.email || !user?.name) continue;

    await sendProjectMail({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      project: {
        title: project.title,
        description: project.description,
        slug: project.slug || project.id || "",
      },
    });

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }
}
