/**
 * Email job processor
 */
import { sendNotificationMail } from "@/services/email.service";

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 500
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function processEmailJob(data: {
  users: EmailUser[];
  content: EmailContent;
  delayMs?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  maxDurationMs?: number;
  unsubscribeUrl?: string;
}) {
  const {
    users,
    content,
    delayMs = 400,
    retryAttempts = 3,
    retryDelayMs = 500,
    maxDurationMs,
    unsubscribeUrl
  } = data || {};

  if (!users || !content) {
    throw new Error("Invalid email job payload");
  }

  console.log("Processing email job for content:", content.title);

  const deadline =
    typeof maxDurationMs === "number" && maxDurationMs > 0
      ? Date.now() + maxDurationMs
      : null;

  let sentCount = 0;

  for (const user of users) {
    if (!user?.email || !user?.name) continue;

    if (deadline && Date.now() > deadline) {
      console.warn(
        "Email job timed out before completion",
        `sent=${sentCount}`,
        `total=${users.length}`
      );
      break;
    }

    await withRetry(
      () =>
        sendNotificationMail({
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
          content: {
            type: content.type ?? "project",
            title: content.title,
            description: content.description,
            url: content.url,
          },
          unsubscribeUrl
        }),
      retryAttempts,
      retryDelayMs
    );

    if (delayMs > 0) {
      await sleep(delayMs);
    }

    sentCount += 1;
  }

  return { sent: sentCount, total: users.length };
}
