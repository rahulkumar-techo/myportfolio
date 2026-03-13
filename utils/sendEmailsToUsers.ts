// Send email notifications directly (serverless-safe)
import { processEmailJob } from "@/jobs/email.job";

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
  project: EmailProject,
  options?: {
    delayMs?: number;
    retryAttempts?: number;
    retryDelayMs?: number;
    maxDurationMs?: number;
    fireAndForget?: boolean;
  }
) {
  if (!users?.length) return;

  const payload = {
    users,
    project,
    delayMs: options?.delayMs ?? 250,
    retryAttempts: options?.retryAttempts ?? 3,
    retryDelayMs: options?.retryDelayMs ?? 500,
    maxDurationMs: options?.maxDurationMs
  };

  if (options?.fireAndForget) {
    setTimeout(() => {
      processEmailJob(payload).catch((error) => {
        console.error("Background email job failed", error);
      });
    }, 0);
    return;
  }

  await processEmailJob(payload);
}
