/**
 * BullMQ Email Queue
 */

import { Queue, DefaultJobOptions } from "bullmq";
import { redisConnection } from "./redis";

const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000
  },
  removeOnComplete: 100,
  removeOnFail: 100
};

export const emailQueue = new Queue("email-queue", {
  connection: redisConnection as any,
  defaultJobOptions
});

export async function addEmailJobs(users: any[], project: any) {
  if (!users?.length) return [];
  const jobs = users.map((user) => ({
    name: "send-email",
    data: { user, project },
  }));

  return emailQueue.addBulk(jobs);
}

// Faster: enqueue a single job; worker will fetch users.
export async function addProjectEmailJob(project: any) {
  return emailQueue.add("send-project-email", { project });
}
