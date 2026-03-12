/**
 * Worker to process email jobs
 */

import { Worker } from "bullmq";
import { redisConnection } from "../lib/redis";
import { sendProjectMail } from "../services/email.service";
import { findNonAdminUsers } from "../repositories/user-repository";
import { sendEmailsToUsers } from "../utils/sendEmailsToUsers";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {

    const { user, project } = job.data;

    if (user && project) {
      console.log("Sending email to:", user.email);
      await sendProjectMail({ user, project });
      return { success: true };
    }

    if (project) {
      const users = await findNonAdminUsers();
      console.log("Sending project email to users:", users.length);
      await sendEmailsToUsers(users as any[], project);
      return { success: true };
    }

    throw new Error("Invalid job payload: missing user/project");
  },
  {
    connection: redisConnection as any,
  }
);

emailWorker.on("completed", (job) => {
  console.log("Email sent:", job.id);
});

emailWorker.on("failed", (job, err) => {
  console.error("Email job failed:", job?.id, err);
});
