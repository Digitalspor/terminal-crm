import { google, gmail_v1 } from "googleapis";

interface EmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  data: string; // base64
}

interface EmailWithAttachments {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  attachments: EmailAttachment[];
}

/**
 * Henter e-poster med vedlegg som sannsynligvis er fakturaer/bilag
 */
export async function fetchEmailsWithAttachments(
  gmail: gmail_v1.Gmail,
  options: {
    query?: string;
    maxResults?: number;
    afterDate?: Date;
  } = {}
): Promise<EmailWithAttachments[]> {
  // Standard query for å finne fakturaer/bilag
  const defaultQuery = [
    "has:attachment",
    "(from:faktura OR from:invoice OR from:regning OR from:kvittering",
    "OR subject:faktura OR subject:invoice OR subject:kvittering OR subject:bilag",
    "OR filename:pdf OR filename:faktura)",
    "-in:trash",
    "-label:Bilag-Behandlet"
  ].join(" ");

  let query = options.query || defaultQuery;

  if (options.afterDate) {
    const timestamp = Math.floor(options.afterDate.getTime() / 1000);
    query += ` after:${timestamp}`;
  }

  console.log("[Gmail] Søker:", query);

  const response = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: options.maxResults || 10,
  });

  const messages = response.data.messages || [];
  const results: EmailWithAttachments[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;

    const fullMessage = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const headers = fullMessage.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

    const attachments: EmailAttachment[] = [];

    // Rekursiv funksjon for å finne vedlegg
    async function extractAttachments(part: gmail_v1.Schema$MessagePart) {
      if (part.filename && part.body?.attachmentId) {
        // Hent vedleggsdata
        const attachment = await gmail.users.messages.attachments.get({
          userId: "me",
          messageId: msg.id!,
          id: part.body.attachmentId,
        });

        if (attachment.data.data) {
          // Filtrer kun relevante filtyper
          const mimeType = part.mimeType || "";
          if (
            mimeType.includes("pdf") ||
            mimeType.includes("image") ||
            part.filename.toLowerCase().endsWith(".pdf") ||
            part.filename.toLowerCase().endsWith(".png") ||
            part.filename.toLowerCase().endsWith(".jpg") ||
            part.filename.toLowerCase().endsWith(".jpeg")
          ) {
            attachments.push({
              filename: part.filename,
              mimeType: mimeType,
              size: part.body.size || 0,
              data: attachment.data.data,
            });
          }
        }
      }

      // Sjekk underordnede deler
      if (part.parts) {
        for (const subPart of part.parts) {
          await extractAttachments(subPart);
        }
      }
    }

    if (fullMessage.data.payload) {
      await extractAttachments(fullMessage.data.payload);
    }

    // Kun inkluder e-poster med relevante vedlegg
    if (attachments.length > 0) {
      results.push({
        id: msg.id,
        threadId: fullMessage.data.threadId || "",
        from: getHeader("from"),
        subject: getHeader("subject"),
        date: getHeader("date"),
        attachments,
      });
    }
  }

  console.log(`[Gmail] Fant ${results.length} e-poster med vedlegg`);
  return results;
}

/**
 * Markerer e-post som behandlet ved å legge til label
 */
export async function markEmailProcessed(
  gmail: gmail_v1.Gmail,
  messageId: string,
  labelName: string = "Bilag-Behandlet"
): Promise<boolean> {
  try {
    // Sjekk om label finnes, opprett hvis ikke
    const labels = await gmail.users.labels.list({ userId: "me" });
    let labelId = labels.data.labels?.find(
      (l) => l.name === labelName
    )?.id;

    if (!labelId) {
      const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      labelId = newLabel.data.id || undefined;
    }

    if (labelId) {
      await gmail.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: {
          addLabelIds: [labelId],
          removeLabelIds: ["UNREAD"],
        },
      });
      console.log(`[Gmail] E-post ${messageId} markert som behandlet`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("[Gmail] Feil ved markering:", error);
    return false;
  }
}

/**
 * Konverterer base64 vedlegg til buffer for videre behandling
 */
export function decodeAttachment(base64Data: string): Buffer {
  // Gmail bruker URL-safe base64
  const normalized = base64Data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64");
}
