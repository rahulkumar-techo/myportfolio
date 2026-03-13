/**
 * BullMQ email worker
 */

import { Worker } from "bullmq";
import { processEmailJob } from "@/jobs/email.job";
import { getRedisConnection } from "@/lib/redis";

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

type EmailJobPayload = {
  users: EmailUser[];
  project: EmailProject;
  delayMs?: number;
};

function describeType(value: unknown) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateEmailJobPayload(data: unknown) {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, error: "payload must be an object" };
  }

  const payload = data as EmailJobPayload;

  if (!Array.isArray(payload.users)) {
    errors.push(`users must be an array (got ${describeType(payload.users)})`);
  } else if (payload.users.length === 0) {
    errors.push("users must not be empty");
  } else {
    const firstInvalid = payload.users.findIndex(
      (user) => !user || !user.email || !user.name
    );
    if (firstInvalid !== -1) {
      errors.push(`users[${firstInvalid}] must include name and email`);
    }
  }

  if (!payload.project || typeof payload.project !== "object") {
    errors.push(`project must be an object (got ${describeType(payload.project)})`);
  } else {
    if (!payload.project.title) errors.push("project.title is required");
    if (!payload.project.description) errors.push("project.description is required");
  }

  if (
    payload.delayMs !== undefined &&
    (typeof payload.delayMs !== "number" || Number.isNaN(payload.delayMs))
  ) {
    errors.push("delayMs must be a valid number when provided");
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join("; ") };
  }

  return { valid: true };
}

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {

    console.log("Processing job:", job.id);

    const validation = validateEmailJobPayload(job.data);
    if (!validation.valid) {
      throw new Error(`Invalid email job payload: ${validation.error}`);
    }

    await processEmailJob(job.data);

  },
  {
    connection: getRedisConnection() as any,
    concurrency: 3,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});

console.log("Email worker started...");
