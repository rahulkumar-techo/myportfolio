import "dotenv/config";
import nodemailer from "nodemailer";
import { generateNotificationEmailTemplate } from "@/utils/email-template";

function resolveRecipient() {
  const testEmail = process.env.TEST_NOTIFICATION_EMAIL;
  if (testEmail && testEmail.trim().length > 0) {
    return testEmail.trim();
  }

  const fallback = process.env.GMAIL_EMAIL;
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim();
  }

  return "";
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const safeName = name.length <= 2 ? `${name[0]}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
}

async function run() {
  const recipient = resolveRecipient();
  if (!recipient) {
    throw new Error("No TEST_NOTIFICATION_EMAIL or GMAIL_EMAIL found.");
  }

  const gmailUser = process.env.GMAIL_EMAIL || recipient;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPass) {
    throw new Error("GMAIL_APP_PASSWORD is not set.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailPass
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });

  await transporter.verify();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const html = generateNotificationEmailTemplate({
    username: "Test Subscriber",
    email: recipient,
    userAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    contentTitle: "Test Notification",
    contentDescription: "This is a live test email from the portfolio notification system.",
    contentUrl: baseUrl ? `${baseUrl}/notifications` : "/notifications",
    contentType: "project",
    companyLogo: baseUrl ? `${baseUrl}/logo.png` : "/logo.png"
  });

  await transporter.sendMail({
    from: `Rahul Portfolio <${gmailUser}>`,
    to: recipient,
    subject: "Test Notification Delivery",
    html
  });

  transporter.close();
  console.log(`Sent test notification email to ${maskEmail(recipient)}`);
}

run().catch((error) => {
  console.error("Test notification failed", error);
  process.exitCode = 1;
});
