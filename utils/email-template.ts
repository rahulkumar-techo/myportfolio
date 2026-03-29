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
  const preheader = `${title}: ${contentTitle}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f6fb; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; font-size:1px; line-height:1px;">
      ${preheader}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f6fb; padding:28px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                 style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#0f172a; padding:20px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <img src="${companyLogo}" alt="Portfolio" width="120" style="display:block;" />
                    </td>
                    <td align="right" style="color:#cbd5f5; font-size:11px; letter-spacing:0.2em; font-weight:600;">
                      PORTFOLIO UPDATE
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <img src="${userAvatar}" width="56" height="56"
                           style="border-radius:50%; border:2px solid #e2e8f0; display:block;" />
                    </td>
                    <td style="padding-left:16px;">
                      <p style="margin:0; color:#111827; font-size:16px; font-weight:600;">
                        Hi ${username},
                      </p>
                      <p style="margin:4px 0 0; color:#6b7280; font-size:12px;">
                        ${email}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px 28px;">
                <h1 style="margin:0 0 10px; font-size:22px; color:#0f172a; line-height:1.3;">
                  ${title}
                </h1>
                <p style="margin:0 0 18px; color:#475569; font-size:15px; line-height:1.6;">
                  A new update just landed in the portfolio. Here is what is fresh:
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                       style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                  <tr>
                    <td style="padding:18px;">
                      <p style="margin:0 0 6px; color:#0f172a; font-weight:600; font-size:16px;">
                        ${contentTitle}
                      </p>
                      <p style="margin:0; color:#64748b; font-size:14px; line-height:1.6;">
                        ${contentDescription}
                      </p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:22px;">
                  <tr>
                    <td align="center">
                      <a href="${contentUrl}"
                         style="background:#111827; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:10px; font-weight:600; font-size:14px; display:inline-block;">
                        ${ctaLabel}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background:#f1f5f9; padding:18px 24px; text-align:center;">
                <p style="margin:0; color:#6b7280; font-size:12px;">
                  You are receiving this update because you subscribed to portfolio notifications.
                </p>
                ${unsubscribeUrl ? `<p style="margin:8px 0 0;"><a href="${unsubscribeUrl}" style="color:#111827; font-weight:600; font-size:12px; text-decoration:none;">Unsubscribe</a></p>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
  <body style="margin:0; padding:0; background:#f4f6fb; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f6fb; padding:28px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                 style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#0f172a; padding:20px 28px; text-align:center;">
                <img src="${companyLogo}" alt="Portfolio" width="120" style="display:inline-block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px; text-align:center;">
                <img src="${userAvatar}" width="64" height="64"
                     style="border-radius:50%; border:2px solid #e2e8f0; display:block; margin:0 auto;" />
                <h2 style="margin:16px 0 6px; color:#0f172a; font-size:22px;">
                  Confirm your subscription
                </h2>
                <p style="margin:0; color:#64748b; font-size:13px;">${email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 28px; text-align:center;">
                <p style="color:#475569; line-height:1.6; font-size:15px; margin:0 0 22px;">
                  Hi ${username}, please confirm your email to start receiving portfolio updates.
                </p>
                <a href="${confirmUrl}"
                   style="background:#111827; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:10px; font-weight:600; font-size:14px; display:inline-block;">
                  Confirm Subscription
                </a>
                <p style="color:#94a3b8; font-size:12px; margin:18px 0 0;">
                  If you did not request updates, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
