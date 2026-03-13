/**
 * BullMQ email queue
 */
import { Queue } from "bullmq";
import { getRedisConnection } from "../redis";

export const EMAIL_QUEUE_NAME = "email-queue";

let cachedQueue: Queue | null = null;

function getEmailQueue() {
  if (cachedQueue) return cachedQueue;

  cachedQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: getRedisConnection() as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  return cachedQueue;
}

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

export async function enqueueProjectEmails(
  users: EmailUser[],
  project: EmailProject
) {
  if (!users?.length) return;

  const emailQueue = getEmailQueue();
  await emailQueue.add("send-project-emails", { users, project });
}
