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
  project: EmailProject;
  delayMs?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  maxDurationMs?: number;
}) {
  const {
    users,
    project,
    delayMs = 400,
    retryAttempts = 3,
    retryDelayMs = 500,
    maxDurationMs
  } = data || {};

  if (!users || !project) {
    throw new Error("Invalid email job payload");
  }

  console.log("Processing email job for project:", project.title);

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
        sendProjectMail({
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
