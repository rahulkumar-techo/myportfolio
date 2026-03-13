// Enqueue email job for all users
import { enqueueProjectEmails } from "@/lib/queue/email.queue";

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

export async function sendEmailsToUsers(
  users: EmailUser[],
  project: EmailProject
) {
  await enqueueProjectEmails(users, project);
}
