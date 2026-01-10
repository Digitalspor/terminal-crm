import { supabase } from "../core/supabase.js";
import { fetchNewEmails, getGmailClient } from "../tools/gmail.js";
import { runEmailAnalyzer } from "../agents/email-analyzer.js";

export async function pollEmails(): Promise<{
  processed: number;
  errors: number;
}> {
  let processed = 0;
  let errors = 0;

  // Get all agencies with active Gmail integration
  const { data: integrations } = await supabase
    .from("agency_integrations")
    .select("agency_id")
    .eq("provider", "gmail")
    .eq("is_active", true);

  if (!integrations || integrations.length === 0) {
    console.log("[EMAIL-POLL] No active Gmail integrations found");
    return { processed: 0, errors: 0 };
  }

  for (const integration of integrations) {
    const agencyId = integration.agency_id;

    try {
      const gmail = await getGmailClient(agencyId);
      if (!gmail) continue;

      // Get last processed email timestamp
      const { data: lastEmail } = await supabase
        .from("emails")
        .select("received_at")
        .eq("agency_id", agencyId)
        .order("received_at", { ascending: false })
        .limit(1)
        .single();

      const afterDate = lastEmail?.received_at
        ? new Date(lastEmail.received_at)
        : undefined;

      const emails = await fetchNewEmails(gmail, afterDate);
      console.log(
        `[EMAIL-POLL] Found ${emails.length} new emails for agency ${agencyId}`,
      );

      for (const email of emails) {
        // Check if already processed
        const { data: existing } = await supabase
          .from("emails")
          .select("id")
          .eq("gmail_message_id", email.messageId)
          .single();

        if (existing) {
          continue;
        }

        // Insert email record
        const { data: inserted, error: insertError } = await supabase
          .from("emails")
          .insert({
            agency_id: agencyId,
            gmail_message_id: email.messageId,
            gmail_thread_id: email.threadId,
            from_email: email.from.email,
            from_name: email.from.name,
            to_email: email.to,
            subject: email.subject,
            body_text: email.bodyText,
            body_html: email.bodyHtml,
            received_at: email.receivedAt.toISOString(),
            is_processed: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("[EMAIL-POLL] Failed to insert email:", insertError);
          errors++;
          continue;
        }

        // Run email analyzer
        try {
          await runEmailAnalyzer(inserted.id);
          processed++;
        } catch (analyzerError) {
          console.error(
            "[EMAIL-POLL] Email analyzer failed:",
            analyzerError,
          );
          errors++;
        }
      }
    } catch (error) {
      console.error(
        `[EMAIL-POLL] Error processing agency ${agencyId}:`,
        error,
      );
      errors++;
    }
  }

  return { processed, errors };
}
