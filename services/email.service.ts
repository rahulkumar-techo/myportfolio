// Email transporter using Brevo SMTP

import { generateProjectEmailTemplate } from "@/utils/email-template";
import nodemailer from "nodemailer";


const gmailUser = process.env.GMAIL_EMAIL || "mrrhl02@gmail.com";
const gmailPass =
  process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_LESSSECURE_PASSWORD;

if (!gmailPass) {
  throw new Error("GMAIL_APP_PASSWORD is not set");
}

const gmailInstance = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
};
export const transporter = nodemailer.createTransport(gmailInstance);


interface SendMailProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  project: {
    title: string;
    description: string;
    slug: string;
  };
}

export async function sendProjectMail({ user, project }: SendMailProps) {

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rahulkumardev.vercel.app";

  const html = generateProjectEmailTemplate({
    username: user.name,
    email: user.email,
    userAvatar:
      user.image ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    projectTitle: project.title,
    projectDescription: project.description,
    projectUrl: `${baseUrl}/projects/${project.slug}`,
    companyLogo: `${baseUrl}/logo.png`
  });

  await transporter.sendMail({
    from: `Rahul Portfolio <${gmailUser}>`,
    to: user.email,
    subject: "🚀 New Project Published",
    html
  });
}
