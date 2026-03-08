import type { WhaleTransaction } from "@/types";

const TELEGRAM_API = "https://api.telegram.org";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

async function sendMessage(chatId: string, text: string): Promise<void> {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const url = `${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
}

export async function sendTelegramAlert(
  chatId: string,
  transaction: WhaleTransaction,
  alertLabel?: string
): Promise<void> {
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(transaction.usdValue);

  const from = escapeMarkdown(transaction.fromLabel ?? `${transaction.fromAddress.slice(0, 10)}...`);
  const to = escapeMarkdown(transaction.toLabel ?? `${transaction.toAddress.slice(0, 10)}...`);
  const label = alertLabel ? `_${escapeMarkdown(alertLabel)}_\n\n` : "";

  const text = [
    `🐋 *Whale Alert*`,
    label,
    `*Amount:* ${escapeMarkdown(usdFormatted)}`,
    `*Token:* ${escapeMarkdown(transaction.token)}`,
    `*Chain:* ${escapeMarkdown(transaction.chain)}`,
    `*Type:* ${escapeMarkdown(transaction.type)}`,
    `*From:* \`${from}\``,
    `*To:* \`${to}\``,
    ``,
    `[View on WhaleVault](${escapeMarkdown(process.env.NEXT_PUBLIC_APP_URL ?? "https://whalevault.io")}/dashboard)`,
  ].join("\n");

  await sendMessage(chatId, text);
}

export async function sendTelegramMessage(chatId: string, message: string): Promise<void> {
  await sendMessage(chatId, escapeMarkdown(message));
}

export async function verifyTelegramWebhook(token: string): Promise<boolean> {
  return token === BOT_TOKEN;
}
