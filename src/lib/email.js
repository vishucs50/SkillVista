import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const getSesClient = () => {
  const region = process.env.SES_REGION || process.env.S3_REGION;
  const accessKeyId =
    process.env.SES_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.SES_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("SES configuration is incomplete");
  }

  return new SESv2Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function sendWelcomeEmail({ name, email }) {
  const fromEmail = process.env.SES_FROM_EMAIL;
  const appUrl = process.env.NEXTAUTH_URL;

  if (!fromEmail || !appUrl) {
    throw new Error("SES_FROM_EMAIL or NEXTAUTH_URL is not configured");
  }

  const safeName = escapeHtml(name);
  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: { ToAddresses: [email] },
    Content: {
      Simple: {
        Subject: { Data: "Welcome to SkillVista", Charset: "UTF-8" },
        Body: {
          Html: {
            Data: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <h2>Welcome to SkillVista, ${safeName}!</h2>
                <p>Your career-readiness journey starts here.</p>
                <p>Complete your assessment to discover your strengths,
                skill gaps, and recommended next steps.</p>
                <p><a href="${escapeHtml(appUrl)}/dashboard">Open your dashboard</a></p>
              </div>
            `,
            Charset: "UTF-8",
          },
          Text: {
            Data: `Welcome to SkillVista, ${name}!\n\nOpen your dashboard: ${appUrl}/dashboard`,
            Charset: "UTF-8",
          },
        },
      },
    },
  });

  await getSesClient().send(command);
}
