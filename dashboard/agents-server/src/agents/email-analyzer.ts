import { callClaudeJSON } from "../core/anthropic.js";
import { supabase } from "../core/supabase.js";
import { createAgentLogger } from "../core/logger.js";

interface EmailClassification {
  type: "support" | "bug" | "feature" | "project" | "inquiry" | "spam" | "other";
  urgency: "low" | "medium" | "high" | "urgent";
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  suggested_title: string;
  keywords: string[];
  should_create_task: boolean;
  customer_match?: {
    confidence: "high" | "medium" | "low";
    matched_by: "email" | "domain" | "name";
  };
}

const SYSTEM_PROMPT = `Du er en email-klassifiserings-agent for et web-byrå. Din jobb er å analysere innkommende emails og klassifisere dem.

Returner ALLTID valid JSON med følgende struktur:
{
  "type": "support" | "bug" | "feature" | "project" | "inquiry" | "spam" | "other",
  "urgency": "low" | "medium" | "high" | "urgent",
  "sentiment": "positive" | "neutral" | "negative",
  "summary": "Kort oppsummering på norsk (maks 100 ord)",
  "suggested_title": "Foreslått oppgavetittel på norsk",
  "keywords": ["nøkkelord1", "nøkkelord2"],
  "should_create_task": true/false,
  "customer_match": {
    "confidence": "high" | "medium" | "low",
    "matched_by": "email" | "domain" | "name"
  }
}

Klassifiserings-regler:
- "support": Tekniske problemer, feilmeldinger, "noe fungerer ikke"
- "bug": Spesifikke bugs, feil i kode/funksjonalitet
- "feature": Nye ønsker, forbedringer, "kan dere legge til..."
- "project": Større prosjekter, redesign, nye nettsider
- "inquiry": Generelle spørsmål, pristilbud
- "spam": Reklame, nyhetsbrev, ikke-relevante emails
- "other": Alt annet

Urgency-regler:
- "urgent": Nettsted nede, kritisk feil, produksjonsproblem
- "high": Påvirker forretning, kunde venter
- "medium": Standard forespørsel
- "low": Ingen hast, fremtidige planer

should_create_task = false for:
- Spam
- Auto-svar
- Nyhetsbrev
- Kvitteringer
`;

export async function runEmailAnalyzer(
  emailId: string,
): Promise<{ success: boolean; taskId?: string; error?: string }> {
  // Get email first to get agency_id for logger
  const { data: email, error: emailError } = await supabase
    .from("emails")
    .select("*")
    .eq("id", emailId)
    .single();

  if (emailError || !email) {
    return { success: false, error: "Email not found" };
  }

  // Initialize logger with context
  const logger = createAgentLogger("email-analyzer", {
    agencyId: email.agency_id,
    emailId: emailId,
    inputSummary: `Email from ${email.from_email}: "${email.subject}"`,
  });

  await logger.start(`Processing email: ${email.subject}`);

  // Get existing customers for matching
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, wordpress_url")
    .eq("agency_id", email.agency_id);

  const customerContext =
    customers
      ?.map(
        (c) =>
          `- ${c.name} (${c.email || "no email"}) - ${c.wordpress_url || "no url"}`,
      )
      .join("\n") || "Ingen kunder registrert";

  // Call Claude for classification
  const userMessage = `Analyser denne emailen:

Fra: ${email.from_name} <${email.from_email}>
Emne: ${email.subject}
Dato: ${email.received_at}

Innhold:
${email.body_text}

---
Eksisterende kunder:
${customerContext}

Prøv å matche emailen til en eksisterende kunde basert på email-adresse, domene, eller navn.`;

  let classification: EmailClassification;
  try {
    classification = await callClaudeJSON<EmailClassification>(
      SYSTEM_PROMPT,
      userMessage,
    );
  } catch (parseError) {
    await logger.error(parseError as Error, "Failed to parse Claude response");
    await supabase
      .from("emails")
      .update({
        is_processed: true,
        processing_error: "Failed to classify email",
      })
      .eq("id", emailId);
    return { success: false, error: "Classification failed" };
  }

  // Try to match customer
  let customerId: string | null = null;
  if (customers && classification.customer_match) {
    const fromDomain = email.from_email.split("@")[1];

    for (const customer of customers) {
      // Match by email
      if (customer.email === email.from_email) {
        customerId = customer.id;
        break;
      }
      // Match by domain
      if (customer.wordpress_url?.includes(fromDomain)) {
        customerId = customer.id;
        break;
      }
    }
  }

  // Update email with classification
  await supabase
    .from("emails")
    .update({
      is_processed: true,
      processed_at: new Date().toISOString(),
      classification_json: classification,
      customer_id: customerId,
    })
    .eq("id", emailId);

  // Create task if needed
  let taskId: string | undefined;
  if (classification.should_create_task) {
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        agency_id: email.agency_id,
        customer_id: customerId,
        title: classification.suggested_title,
        description: `**Oppsummering:** ${classification.summary}\n\n**Original email fra:** ${email.from_name || email.from_email}\n**Emne:** ${email.subject}\n\n---\n\n${email.body_text}`,
        status: "new",
        priority: classification.urgency,
        category: classification.type,
        source: "email",
        source_email_id: emailId,
      })
      .select()
      .single();

    if (task) {
      taskId = task.id;

      // Link task back to email
      await supabase.from("emails").update({ task_id: taskId }).eq("id", emailId);
    } else {
      await logger.warning(`Failed to create task: ${taskError?.message}`);
    }
  }

  // Log success
  await logger.success(
    classification.should_create_task ? `Created task: ${taskId}` : "No task needed",
    `Type: ${classification.type}, Urgency: ${classification.urgency}`
  );

  return { success: true, taskId };
}
