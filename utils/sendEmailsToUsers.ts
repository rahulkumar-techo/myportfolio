// Send email notifications directly (serverless-safe)
import { processEmailJob } from "@/jobs/email.job";

type EmailUser = {
  name: string;
  email: string;
  image?: string;
};

type NotificationType = "project" | "blog" | "asset";

type EmailContent = {
  type?: NotificationType;
  title: string;
  description: string;
  url: string;
};

export async function sendEmailsToUsers(
  users: EmailUser[],
  content: EmailContent,
  options?: {
    delayMs?: number;
    retryAttempts?: number;
    retryDelayMs?: number;
    maxDurationMs?: number;
    fireAndForget?: boolean;
    unsubscribeUrl?: string;
  }
) {
  if (!users?.length) return;

  const payload = {
    users,
    content,
    delayMs: options?.delayMs ?? 250,
    retryAttempts: options?.retryAttempts ?? 3,
    retryDelayMs: options?.retryDelayMs ?? 500,
    maxDurationMs: options?.maxDurationMs,
    unsubscribeUrl: options?.unsubscribeUrl
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
