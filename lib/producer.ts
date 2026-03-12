/**
 * BullMQ Email Queue
 */

import { Queue, DefaultJobOptions } from "bullmq";
import { getRedisConnection } from "./redis";

const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000
  },
  removeOnComplete: 100,
  removeOnFail: 100
};

let cachedQueue: Queue | null = null;

function getEmailQueue() {
  if (!cachedQueue) {
    cachedQueue = new Queue("email-queue", {
      connection: getRedisConnection() as any,
      defaultJobOptions
    });
  }

  return cachedQueue;
}

export async function addEmailJobs(users: any[], project: any) {
  if (!users?.length) return [];
  const jobs = users.map((user) => ({
    name: "send-email",
    data: { user, project },
  }));

  return getEmailQueue().addBulk(jobs);
}

// Faster: enqueue a single job; worker will fetch users.
export async function addProjectEmailJob(project: any) {
  return getEmailQueue().add("send-project-email", { project });
}
