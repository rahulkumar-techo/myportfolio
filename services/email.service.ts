// Email transporter using Brevo SMTP

import { generateProjectEmailTemplate } from "@/utils/email-template";
import nodemailer from "nodemailer";


const gmailUser = process.env.GMAIL_EMAIL || "mrrhl02@gmail.com";

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const gmailPass = process.env.GMAIL_APP_PASSWORD;

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

  cachedTransporter = nodemailer.createTransport(gmailInstance);
  return cachedTransporter;
}


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

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Rahul Portfolio <${gmailUser}>`,
    to: user.email,
    subject: "🚀 New Project Published",
    html
  });
}
