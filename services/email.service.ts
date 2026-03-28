// Email transporter using Brevo SMTP

import {
  generateConfirmationEmailTemplate,
  generateNotificationEmailTemplate,
  generateProjectEmailTemplate
} from "@/utils/email-template";
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


type NotificationType = "project" | "blog" | "asset";

interface SendNotificationProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  content: {
    type: NotificationType;
    title: string;
    description: string;
    url: string;
  };
  unsubscribeUrl?: string;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://rahulkumardev.vercel.app";
}

function getSubject(type: NotificationType) {
  switch (type) {
    case "blog":
      return "📰 New Blog Post Published";
    case "asset":
      return "📦 New Portfolio Asset Added";
    default:
      return "🚀 New Project Published";
  }
}

export async function sendNotificationMail({ user, content, unsubscribeUrl }: SendNotificationProps) {
  const baseUrl = getBaseUrl();
  const resolvedUnsubscribeUrl = unsubscribeUrl
    ? `${unsubscribeUrl}?email=${encodeURIComponent(user.email)}`
    : undefined;

  const html = generateNotificationEmailTemplate({
    username: user.name,
    email: user.email,
    userAvatar:
      user.image ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    contentTitle: content.title,
    contentDescription: content.description,
    contentUrl: content.url,
    contentType: content.type,
    companyLogo: `${baseUrl}/logo.png`,
    unsubscribeUrl: resolvedUnsubscribeUrl
  });

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Rahul Portfolio <${gmailUser}>`,
    to: user.email,
    subject: getSubject(content.type),
    html
  });
}

export async function sendConfirmationMail(input: {
  user: { name: string; email: string; image?: string };
  confirmUrl: string;
}) {
  const baseUrl = getBaseUrl();
  const html = generateConfirmationEmailTemplate({
    username: input.user.name,
    email: input.user.email,
    userAvatar:
      input.user.image ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    confirmUrl: input.confirmUrl,
    companyLogo: `${baseUrl}/logo.png`
  });

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Rahul Portfolio <${gmailUser}>`,
    to: input.user.email,
    subject: "Confirm your notification subscription",
    html
  });
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
  const baseUrl = getBaseUrl();

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
