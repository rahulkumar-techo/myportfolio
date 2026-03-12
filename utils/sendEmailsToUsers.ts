// Send email to all users

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

export async function sendEmailsToUsers(
  users: EmailUser[],
  project: EmailProject,
  delayMs = 400
) {
  if (!users?.length) return;

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
        slug: project.id as string,
      },
    });

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }
}
