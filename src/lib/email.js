import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const getSesClient = () => {
  const region = process.env.SES_REGION || process.env.S3_REGION || "ap-south-1";
  const accessKeyId =
    process.env.SES_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.SES_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;

  return new SESv2Client({
    region,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
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

  const safeName = escapeHtml(name || "there");
  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: { ToAddresses: [email] },
    Content: {
      Simple: {
        Subject: { Data: "Welcome to SkillVista", Charset: "UTF-8" },
        Body: {
          Html: {
            Data: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px">
                <h2 style="color:#0f172a;margin-top:0">Welcome to SkillVista, ${safeName}!</h2>
                <p>Your career-readiness journey starts here.</p>
                <p>Complete your assessment to discover your strengths, skill gaps, and recommended next steps.</p>
                <div style="margin:24px 0">
                  <a href="${escapeHtml(appUrl)}/dashboard" style="background-color:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block">Open your dashboard</a>
                </div>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
                <p style="font-size:12px;color:#64748b;margin-bottom:0">SkillVista - AI-Powered Career Readiness</p>
              </div>
            `,
            Charset: "UTF-8",
          },
          Text: {
            Data: `Welcome to SkillVista, ${name || "there"}!\n\nYour career-readiness journey starts here.\nComplete your assessment to discover your strengths, skill gaps, and recommended next steps.\n\nOpen your dashboard: ${appUrl}/dashboard`,
            Charset: "UTF-8",
          },
        },
      },
    },
  });

  await getSesClient().send(command);
}

export async function sendAssessmentResultEmail({ name, email, result }) {
  const fromEmail = process.env.SES_FROM_EMAIL;
  const appUrl = process.env.NEXTAUTH_URL;

  if (!fromEmail || !appUrl) {
    throw new Error("SES_FROM_EMAIL or NEXTAUTH_URL is not configured");
  }

  const safeName = escapeHtml(name || "there");
  const employabilityIndex = Math.round(result?.employabilityIndex ?? 0);
  const aptitudeScore = Math.round(result?.aptitudeScore ?? 0);
  const breakdown = result?.readinessBreakdown || {};
  const skillsScore = Math.round(breakdown.skills ?? 0);
  const experienceScore = Math.round(breakdown.experience ?? 0);
  const consistencyScore = Math.round(breakdown.consistency ?? 0);

  const skillGaps = Array.isArray(result?.criticalSkillGaps)
    ? result.criticalSkillGaps.slice(0, 5)
    : [];
  const nextActions = Array.isArray(result?.nextBestActions)
    ? result.nextBestActions.slice(0, 4)
    : [];

  const skillGapsHtml = skillGaps.length
    ? skillGaps.map((gap) => `<li style="margin-bottom:6px;color:#dc2626">${escapeHtml(gap)}</li>`).join("")
    : "<li style=\"color:#64748b\">No critical gaps detected! Great job.</li>";

  const nextActionsHtml = nextActions.length
    ? nextActions.map((action) => `<li style="margin-bottom:6px;color:#0f172a">${escapeHtml(action)}</li>`).join("")
    : "<li style=\"color:#64748b\">Review your detailed feedback on the dashboard.</li>";

  const skillGapsText = skillGaps.length
    ? skillGaps.map((gap) => `  - ${gap}`).join("\n")
    : "  - None detected";

  const nextActionsText = nextActions.length
    ? nextActions.map((action, i) => `  ${i + 1}. ${action}`).join("\n")
    : "  - Review your dashboard";

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px">
      <div style="text-align:center;margin-bottom:24px">
        <h1 style="color:#2563eb;font-size:24px;margin:0">SkillVista</h1>
        <p style="color:#64748b;font-size:14px;margin-top:4px">Assessment Result Summary</p>
      </div>

      <h2 style="color:#0f172a;font-size:20px;margin-top:0">Your results are ready, ${safeName}!</h2>
      <p style="color:#475569">You have successfully completed your SkillVista career readiness assessment. Here is your performance overview:</p>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
        <p style="margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600">Career Readiness Index</p>
        <div style="font-size:48px;font-weight:700;color:#2563eb;margin:8px 0">${employabilityIndex}%</div>
        <p style="margin:0;font-size:14px;color:#475569">Aptitude Score: <strong>${aptitudeScore}%</strong></p>
      </div>

      <div style="margin:20px 0">
        <h3 style="color:#0f172a;font-size:16px;margin-bottom:12px">Readiness Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:8px 0;color:#475569">Technical Skills</td>
            <td style="padding:8px 0;font-weight:600;text-align:right;color:#0f172a">${skillsScore}%</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:8px 0;color:#475569">Aptitude</td>
            <td style="padding:8px 0;font-weight:600;text-align:right;color:#0f172a">${aptitudeScore}%</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:8px 0;color:#475569">Practical Experience</td>
            <td style="padding:8px 0;font-weight:600;text-align:right;color:#0f172a">${experienceScore}%</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#475569">Consistency</td>
            <td style="padding:8px 0;font-weight:600;text-align:right;color:#0f172a">${consistencyScore}%</td>
          </tr>
        </table>
      </div>

      <div style="margin:20px 0;background-color:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:4px">
        <h3 style="color:#991b1b;font-size:15px;margin:0 0 8px 0">Critical Skill Gaps to Improve</h3>
        <ul style="margin:0;padding-left:20px;font-size:14px">
          ${skillGapsHtml}
        </ul>
      </div>

      <div style="margin:20px 0;background-color:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:4px">
        <h3 style="color:#1e40af;font-size:15px;margin:0 0 8px 0">Recommended Next Steps</h3>
        <ol style="margin:0;padding-left:20px;font-size:14px">
          ${nextActionsHtml}
        </ol>
      </div>

      <div style="text-align:center;margin:32px 0 20px 0">
        <a href="${escapeHtml(appUrl)}/dashboard" style="background-color:#2563eb;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block;font-size:15px">View Full Assessment Details</a>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
      <p style="font-size:12px;color:#94a3b8;text-align:center;margin:0">
        SkillVista &bull; Empowering Career Readiness through AI
      </p>
    </div>
  `;

  const textContent = `
SkillVista - Assessment Result Summary

Hello ${name || "there"},

Your SkillVista assessment results are ready!

Readiness Score: ${employabilityIndex}%
Aptitude Score: ${aptitudeScore}%

Readiness Breakdown:
- Technical Skills: ${skillsScore}%
- Aptitude: ${aptitudeScore}%
- Experience: ${experienceScore}%
- Consistency: ${consistencyScore}%

Critical Skill Gaps to Improve:
${skillGapsText}

Recommended Next Steps:
${nextActionsText}

View your complete assessment breakdown on your dashboard:
${appUrl}/dashboard
  `.trim();

  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: { ToAddresses: [email] },
    Content: {
      Simple: {
        Subject: {
          Data: "Your SkillVista assessment results are ready 🎯",
          Charset: "UTF-8",
        },
        Body: {
          Html: { Data: htmlContent, Charset: "UTF-8" },
          Text: { Data: textContent, Charset: "UTF-8" },
        },
      },
    },
  });

  await getSesClient().send(command);
}
