// Send email to all users

import { sendProjectMail } from "@/services/email.service";

export async function sendEmailsToUsers(users: any[], project: any) {

  for (const user of users) {

    await sendProjectMail({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      project: {
        title: project.title,
        description: project.description,
        slug: project.id||project.slug,
      },
    });

    // delay to avoid Gmail blocking
    await new Promise((r) => setTimeout(r, 800));
  }

}