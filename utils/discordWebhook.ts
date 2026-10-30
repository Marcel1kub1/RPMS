type WebhookEvent =
  | 'session_start'
  | 'session_end'
  | 'staff_shift'
  | 'chat_log'
  | 'moderation'
  | 'error';

interface WebhookPayload {
  event: WebhookEvent;
  title: string;
  description: string;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

const webhookUrl = () => process.env.DISCORD_WEBHOOK_URL;

export async function notifyDiscordWebhook(payload: WebhookPayload): Promise<void> {
  if (process.env.DISCORD_WEBHOOK_ENABLED !== 'true' || !webhookUrl()) return;

  try {
    const response = await fetch(webhookUrl()!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.DISCORD_WEBHOOK_USERNAME || 'RPMS',
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: payload.title,
            description: payload.description,
            color: payload.event === 'error' ? 0xef4444 : 0x5865f2,
            fields: payload.fields,
            timestamp: new Date().toISOString(),
            footer: { text: 'RPMS' },
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[DiscordWebhook] ${payload.event} failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`[DiscordWebhook] ${payload.event} delivery failed:`, error);
  }
}
