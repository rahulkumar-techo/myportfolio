// Generate HTML email template for new project notification

interface EmailTemplateProps {
  username: string;
  email: string;
  userAvatar: string;
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
  companyLogo: string;
}

export function generateProjectEmailTemplate({
  username,
  email,
  userAvatar,
  projectTitle,
  projectDescription,
  projectUrl,
  companyLogo,
}: EmailTemplateProps) {

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>New Project Published</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f5f6fa; padding:20px;">

    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden;">

      <!-- Company Logo -->
      <div style="background:#111; padding:20px; text-align:center;">
        <img src="${companyLogo}" alt="Company Logo" width="120"/>
      </div>

      <!-- User Info -->
      <div style="padding:20px; text-align:center;">
        <img src="${userAvatar}" width="70" height="70" style="border-radius:50%;" />
        <h2>Hello ${username} 👋</h2>
        <p style="color:#777;">${email}</p>
      </div>

      <!-- Project Message -->
      <div style="padding:20px;">
        <h3>🚀 New Project Published</h3>

        <p>
          A new project has been added to our portfolio.
          Check it out and explore the latest work.
        </p>

        <h4>${projectTitle}</h4>

        <p style="color:#555;">
          ${projectDescription}
        </p>

        <!-- Button -->
        <div style="text-align:center; margin:30px 0;">
          <a href="${projectUrl}"
             style="
             background:#4f46e5;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;">
             View Project
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#666;">
        © 2026 Your Company. All rights reserved.
      </div>

    </div>

  </body>
  </html>
  `;
}