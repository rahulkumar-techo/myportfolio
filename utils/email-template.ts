// Generate HTML email templates for content notifications

type ContentType = "project" | "blog" | "asset";

interface NotificationEmailProps {
  username: string;
  email: string;
  userAvatar: string;
  contentTitle: string;
  contentDescription: string;
  contentUrl: string;
  contentType: ContentType;
  companyLogo: string;
  unsubscribeUrl?: string;
}

function getContentLabel(type: ContentType) {
  switch (type) {
    case "blog":
      return "New Blog Post";
    case "asset":
      return "New Asset Uploaded";
    default:
      return "New Project Published";
  }
}

function getCtaLabel(type: ContentType) {
  switch (type) {
    case "blog":
      return "Read Blog";
    case "asset":
      return "View Asset";
    default:
      return "View Project";
  }
}

export function generateNotificationEmailTemplate({
  username,
  email,
  userAvatar,
  contentTitle,
  contentDescription,
  contentUrl,
  contentType,
  companyLogo,
  unsubscribeUrl,
}: NotificationEmailProps) {
  const title = getContentLabel(contentType);
  const ctaLabel = getCtaLabel(contentType);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f5f6fa; padding:20px;">
    <div style="max-width:620px; margin:auto; background:white; border-radius:14px; overflow:hidden; border:1px solid #e6e8ee;">
      <div style="background:#0f172a; padding:24px; text-align:center;">
        <img src="${companyLogo}" alt="Portfolio" width="120" style="display:inline-block;" />
      </div>

      <div style="padding:28px 32px 8px; text-align:center;">
        <img src="${userAvatar}" width="64" height="64" style="border-radius:50%; border:2px solid #e2e8f0;" />
        <h2 style="margin:16px 0 6px; color:#0f172a;">Hello ${username}</h2>
        <p style="margin:0; color:#64748b; font-size:13px;">${email}</p>
      </div>

      <div style="padding:24px 32px;">
        <h3 style="margin-top:0; color:#0f172a;">${title}</h3>
        <p style="color:#475569; line-height:1.6;">
          A fresh update just landed on the portfolio. Here is the latest drop:
        </p>

        <div style="background:#f8fafc; border-radius:12px; padding:18px; border:1px solid #e2e8f0;">
          <h4 style="margin:0 0 8px; color:#0f172a;">${contentTitle}</h4>
          <p style="margin:0; color:#64748b; line-height:1.6;">
            ${contentDescription}
          </p>
        </div>

        <div style="text-align:center; margin:28px 0 10px;">
          <a href="${contentUrl}"
             style="background:#4f46e5; color:white; padding:12px 22px; text-decoration:none; border-radius:8px; font-weight:600; display:inline-block;">
             ${ctaLabel}
          </a>
        </div>
      </div>

      <div style="background:#f1f5f9; padding:16px 24px; text-align:center; font-size:12px; color:#64748b;">
        <p style="margin:0;">You are receiving this update because you subscribed on the portfolio site.</p>
        ${unsubscribeUrl ? `<p style="margin:6px 0 0;"><a href="${unsubscribeUrl}" style="color:#4f46e5;">Unsubscribe</a></p>` : ""}
      </div>
    </div>
  </body>
  </html>
  `;
}

interface ConfirmationEmailProps {
  username: string;
  email: string;
  userAvatar: string;
  confirmUrl: string;
  companyLogo: string;
}

export function generateConfirmationEmailTemplate({
  username,
  email,
  userAvatar,
  confirmUrl,
  companyLogo,
}: ConfirmationEmailProps) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Confirm Your Subscription</title>
  </head>
  <body style="font-family: Arial, sans-serif; background:#f5f6fa; padding:20px;">
    <div style="max-width:620px; margin:auto; background:white; border-radius:14px; overflow:hidden; border:1px solid #e6e8ee;">
      <div style="background:#0f172a; padding:24px; text-align:center;">
        <img src="${companyLogo}" alt="Portfolio" width="120" style="display:inline-block;" />
      </div>
      <div style="padding:28px 32px 8px; text-align:center;">
        <img src="${userAvatar}" width="64" height="64" style="border-radius:50%; border:2px solid #e2e8f0;" />
        <h2 style="margin:16px 0 6px; color:#0f172a;">Confirm your subscription</h2>
        <p style="margin:0; color:#64748b; font-size:13px;">${email}</p>
      </div>
      <div style="padding:24px 32px;">
        <p style="color:#475569; line-height:1.6;">
          Hi ${username}, please confirm your email to start receiving portfolio updates.
        </p>
        <div style="text-align:center; margin:28px 0 10px;">
          <a href="${confirmUrl}"
             style="background:#4f46e5; color:white; padding:12px 22px; text-decoration:none; border-radius:8px; font-weight:600; display:inline-block;">
             Confirm Subscription
          </a>
        </div>
        <p style="color:#94a3b8; font-size:12px; text-align:center;">
          If you did not request updates, you can ignore this email.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}

interface ProjectTemplateProps {
  username: string;
  email: string;
  userAvatar: string;
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
  companyLogo: string;
  unsubscribeUrl?: string;
}

export function generateProjectEmailTemplate({
  username,
  email,
  userAvatar,
  projectTitle,
  projectDescription,
  projectUrl,
  companyLogo,
  unsubscribeUrl,
}: ProjectTemplateProps) {
  return generateNotificationEmailTemplate({
    username,
    email,
    userAvatar,
    contentTitle: projectTitle,
    contentDescription: projectDescription,
    contentUrl: projectUrl,
    contentType: "project",
    companyLogo,
    unsubscribeUrl
  });
}
