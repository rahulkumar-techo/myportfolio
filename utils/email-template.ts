/**
 * Enterprise Email Template System
 * Clean, scalable, reusable email templates (SaaS-ready)
 */

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type ContentType = "project" | "blog" | "asset";

interface UserInfo {
  username: string;
  email: string;
  userAvatar: string;
}

interface Branding {
  companyLogo: string;
  companyName?: string;
}

interface NotificationEmailProps extends UserInfo, Branding {
  contentTitle: string;
  contentDescription: string;
  contentUrl: string;
  contentType: ContentType;
  unsubscribeUrl?: string;
}

interface ConfirmationEmailProps extends UserInfo, Branding {
  confirmUrl: string;
}

/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */

const CONTENT_CONFIG: Record<
  ContentType,
  { title: string; cta: string }
> = {
  project: {
    title: "New Project Published",
    cta: "View Project",
  },
  blog: {
    title: "New Blog Post",
    cta: "Read Article",
  },
  asset: {
    title: "New Asset Available",
    cta: "View Asset",
  },
};

/* ---------------------------------- */
/* Layout System */
/* ---------------------------------- */

function createEmailLayout({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader?: string;
  body: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f6fb; font-family:Segoe UI, Arial, sans-serif;">
    
    <!-- Preheader -->
    ${
      preheader
        ? `<div style="display:none; opacity:0; max-height:0;">${preheader}</div>`
        : ""
    }

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          
          <table width="100%" style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
            
            ${body}

          </table>

          <!-- Footer -->
          <p style="font-size:11px; color:#9ca3af; margin-top:14px;">
            © ${new Date().getFullYear()} All rights reserved.
          </p>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

function Header({ companyLogo, companyName }: Branding) {
  return `
  <tr>
    <td style="background:#0f172a; padding:20px 28px;">
      <table width="100%">
        <tr>
          <td>
            <img src="${companyLogo}" width="120" alt="${companyName || "Company"}"/>
          </td>
          <td align="right" style="color:#cbd5f5; font-size:11px; letter-spacing:1px;">
            ${companyName?.toUpperCase() || "UPDATE"}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}

function UserBlock({ username, email, userAvatar }: UserInfo) {
  return `
  <tr>
    <td style="padding:24px 28px 8px;">
      <table>
        <tr>
          <td>
            <img src="${userAvatar}" width="52" height="52" style="border-radius:50%;"/>
          </td>
          <td style="padding-left:14px;">
            <p style="margin:0; font-size:15px; font-weight:600;">
              Hi ${username},
            </p>
            <p style="margin:2px 0 0; font-size:12px; color:#6b7280;">
              ${email}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}

function ContentCard(title: string, description: string) {
  return `
  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
    <p style="margin:0; font-weight:600; font-size:15px; color:#0f172a;">
      ${title}
    </p>
    <p style="margin:6px 0 0; font-size:14px; color:#64748b;">
      ${description}
    </p>
  </div>
  `;
}

function CTAButton(url: string, label: string) {
  return `
  <a href="${url}"
     style="display:inline-block; background:#111827; color:#fff; padding:12px 22px; border-radius:10px; text-decoration:none; font-weight:600; font-size:14px;">
     ${label}
  </a>
  `;
}

function Footer(unsubscribeUrl?: string) {
  return `
  <tr>
    <td style="background:#f1f5f9; padding:18px; text-align:center;">
      <p style="margin:0; font-size:12px; color:#6b7280;">
        You are receiving this email because you subscribed to updates.
      </p>
      ${
        unsubscribeUrl
          ? `<p style="margin-top:8px;">
               <a href="${unsubscribeUrl}" style="font-size:12px; font-weight:600; color:#111827;">
                 Unsubscribe
               </a>
             </p>`
          : ""
      }
    </td>
  </tr>
  `;
}

/* ---------------------------------- */
/* Email Templates */
/* ---------------------------------- */

export function generateNotificationEmail(props: NotificationEmailProps) {
  const {
    username,
    email,
    userAvatar,
    companyLogo,
    companyName,
    contentTitle,
    contentDescription,
    contentUrl,
    contentType,
    unsubscribeUrl,
  } = props;

  const config = CONTENT_CONFIG[contentType];

  const body = `
    ${Header({ companyLogo, companyName })}
    ${UserBlock({ username, email, userAvatar })}

    <tr>
      <td style="padding:16px 28px 28px;">
        
        <h2 style="margin:0 0 10px; font-size:20px; color:#0f172a;">
          ${config.title}
        </h2>

        <p style="color:#475569; font-size:14px;">
          A new update is available in your portfolio:
        </p>

        ${ContentCard(contentTitle, contentDescription)}

        <div style="margin-top:22px; text-align:center;">
          ${CTAButton(contentUrl, config.cta)}
        </div>

      </td>
    </tr>

    ${Footer(unsubscribeUrl)}
  `;

  return createEmailLayout({
    title: config.title,
    preheader: `${config.title}: ${contentTitle}`,
    body,
  });
}

/* ---------------------------------- */

export function generateConfirmationEmail({
  username,
  email,
  userAvatar,
  confirmUrl,
  companyLogo,
  companyName,
}: ConfirmationEmailProps) {
  const body = `
    ${Header({ companyLogo, companyName })}

    <tr>
      <td style="padding:32px 28px; text-align:center;">
        
        <img src="${userAvatar}" width="64" style="border-radius:50%;"/>

        <h2 style="margin:16px 0 6px; color:#0f172a;">
          Confirm Your Subscription
        </h2>

        <p style="color:#64748b; font-size:13px;">
          ${email}
        </p>

        <p style="margin:16px 0; color:#475569;">
          Hi ${username}, please confirm your email to start receiving updates.
        </p>

        ${CTAButton(confirmUrl, "Confirm Subscription")}

        <p style="margin-top:18px; font-size:12px; color:#94a3b8;">
          If you didn’t request this, you can ignore this email.
        </p>

      </td>
    </tr>
  `;

  return createEmailLayout({
    title: "Confirm Subscription",
    body,
  });
}

export function generateNotificationEmailTemplate(props: NotificationEmailProps) {
  return generateNotificationEmail(props);
}

export function generateConfirmationEmailTemplate(props: ConfirmationEmailProps) {
  return generateConfirmationEmail(props);
}

export function generateProjectEmailTemplate({
  username,
  email,
  userAvatar,
  projectTitle,
  projectDescription,
  projectUrl,
  companyLogo,
  companyName,
  unsubscribeUrl,
}: {
  username: string;
  email: string;
  userAvatar: string;
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
  companyLogo: string;
  companyName?: string;
  unsubscribeUrl?: string;
}) {
  return generateNotificationEmail({
    username,
    email,
    userAvatar,
    contentTitle: projectTitle,
    contentDescription: projectDescription,
    contentUrl: projectUrl,
    contentType: "project",
    companyLogo,
    companyName,
    unsubscribeUrl,
  });
}
