import sgMail from "@sendgrid/mail";
import type { WhaleTransaction } from "@/types";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? "alerts@whalevault.io";
const FROM_NAME = process.env.SENDGRID_FROM_NAME ?? "WhaleVault";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://whalevault.io";

interface AlertEmailPayload {
  to: string;
  userName?: string;
  transaction: WhaleTransaction;
  alertLabel?: string;
}

export async function sendAlertEmail({
  to,
  userName,
  transaction,
  alertLabel,
}: AlertEmailPayload): Promise<void> {
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(transaction.usdValue);

  const subject = `🐋 Whale Alert: ${usdFormatted} ${transaction.token} moved on ${transaction.chain}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
              <p style="margin:0;font-size:32px;">🐋</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:700;">WhaleVault Alert</h1>
              ${alertLabel ? `<p style="margin:4px 0 0;color:#c4b5fd;font-size:14px;">${alertLabel}</p>` : ""}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">Hi${userName ? ` ${userName}` : ""},</p>
              <p style="margin:0 0 24px;color:#e2e8f0;font-size:16px;">
                A whale transaction just triggered your alert.
              </p>
              <!-- Transaction Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;padding:20px;border:1px solid #334155;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;">Amount</p>
                    <p style="margin:0 0 16px;color:#fff;font-size:28px;font-weight:700;">${usdFormatted}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;color:#94a3b8;font-size:13px;width:40%;">Token</td>
                        <td style="padding:4px 0;color:#e2e8f0;font-size:13px;">${transaction.token}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#94a3b8;font-size:13px;">Chain</td>
                        <td style="padding:4px 0;color:#e2e8f0;font-size:13px;text-transform:capitalize;">${transaction.chain}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#94a3b8;font-size:13px;">Type</td>
                        <td style="padding:4px 0;color:#e2e8f0;font-size:13px;text-transform:capitalize;">${transaction.type}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#94a3b8;font-size:13px;">From</td>
                        <td style="padding:4px 0;color:#e2e8f0;font-size:13px;font-family:monospace;">${transaction.fromLabel ?? `${transaction.fromAddress.slice(0, 10)}...`}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#94a3b8;font-size:13px;">To</td>
                        <td style="padding:4px 0;color:#e2e8f0;font-size:13px;font-family:monospace;">${transaction.toLabel ?? `${transaction.toAddress.slice(0, 10)}...`}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="text-align:center;margin-top:32px;">
                <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                  View in Dashboard →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">
                You received this because you have whale alerts enabled on
                <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">WhaleVault</a>.
                <a href="${APP_URL}/settings/alerts" style="color:#6366f1;text-decoration:none;">Manage alerts</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await sgMail.send({
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<void> {
  await sgMail.send({
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: "🐋 Welcome to WhaleVault",
    html: `
      <p>Hi${name ? ` ${name}` : ""},</p>
      <p>Welcome to WhaleVault – your crypto whale tracking platform.</p>
      <p><a href="${APP_URL}/dashboard">Open your dashboard</a> to start tracking whale wallets and setting up alerts.</p>
      <p>— The WhaleVault Team</p>
    `,
  });
}
