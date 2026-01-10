import { google, gmail_v1 } from "googleapis";
import { supabase } from "../core/supabase.js";

interface GmailTokens {
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
}

export async function getGmailClient(
  agencyId: string,
): Promise<gmail_v1.Gmail | null> {
  // Get OAuth tokens from agency_integrations
  const { data: integration, error } = await supabase
    .from("agency_integrations")
    .select("*")
    .eq("agency_id", agencyId)
    .eq("provider", "gmail")
    .eq("is_active", true)
    .single();

  if (error || !integration) {
    console.error("No Gmail integration found for agency:", agencyId);
    return null;
  }

  const tokens: GmailTokens = {
    access_token: integration.access_token!,
    refresh_token: integration.refresh_token!,
    token_expires_at: integration.token_expires_at!,
  };

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  // Check if token needs refresh
  const expiresAt = new Date(tokens.token_expires_at);
  if (expiresAt < new Date()) {
    console.log("Refreshing Gmail token for agency:", agencyId);
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update tokens in database
    await supabase
      .from("agency_integrations")
      .update({
        access_token: credentials.access_token,
        token_expires_at: credentials.expiry_date
          ? new Date(credentials.expiry_date).toISOString()
          : null,
      })
      .eq("id", integration.id);

    oauth2Client.setCredentials(credentials);
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}

export interface ParsedEmail {
  messageId: string;
  threadId: string;
  from: { name: string | null; email: string };
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml: string | null;
  receivedAt: Date;
}

export async function fetchNewEmails(
  gmail: gmail_v1.Gmail,
  afterTimestamp?: Date,
): Promise<ParsedEmail[]> {
  const query = afterTimestamp
    ? `after:${Math.floor(afterTimestamp.getTime() / 1000)}`
    : "is:unread";

  const response = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 20,
  });

  const messages = response.data.messages || [];
  const emails: ParsedEmail[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;

    const fullMessage = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const parsed = parseGmailMessage(fullMessage.data);
    if (parsed) {
      emails.push(parsed);
    }
  }

  return emails;
}

function parseGmailMessage(
  message: gmail_v1.Schema$Message,
): ParsedEmail | null {
  if (!message.id || !message.threadId) return null;

  const headers = message.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ||
    "";

  const fromHeader = getHeader("from");
  const fromMatch = fromHeader.match(/^(.+?)\s*<(.+?)>$/) || [
    null,
    null,
    fromHeader,
  ];

  let bodyText = "";
  let bodyHtml: string | null = null;

  function extractBody(part: gmail_v1.Schema$MessagePart) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      bodyText = Buffer.from(part.body.data, "base64").toString("utf-8");
    }
    if (part.mimeType === "text/html" && part.body?.data) {
      bodyHtml = Buffer.from(part.body.data, "base64").toString("utf-8");
    }
    if (part.parts) {
      part.parts.forEach(extractBody);
    }
  }

  if (message.payload) {
    extractBody(message.payload);
  }

  const internalDate = message.internalDate
    ? new Date(parseInt(message.internalDate))
    : new Date();

  return {
    messageId: message.id,
    threadId: message.threadId,
    from: {
      name: fromMatch[1]?.trim().replace(/^"|"$/g, "") || null,
      email: fromMatch[2] || fromHeader,
    },
    to: getHeader("to"),
    subject: getHeader("subject"),
    bodyText,
    bodyHtml,
    receivedAt: internalDate,
  };
}

export async function sendEmail(
  gmail: gmail_v1.Gmail,
  to: string,
  subject: string,
  body: string,
  threadId?: string,
): Promise<string | null> {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    body,
  ].join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
      threadId,
    },
  });

  return response.data.id || null;
}
