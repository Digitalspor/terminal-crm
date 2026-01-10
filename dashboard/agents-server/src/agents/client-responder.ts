import { callClaude } from "../core/anthropic.js";
import { supabase } from "../core/supabase.js";
import { getGmailClient, sendEmail } from "../tools/gmail.js";

interface StepResult {
  step_number: number;
  status: "completed" | "failed" | "skipped";
  output?: string;
  error?: string;
  executed_at: string;
}

const SYSTEM_PROMPT = `Du er en profesjonell kundeservice-agent for et web-byrå. Din jobb er å skrive svar-emails til kunder etter at oppgaver er utført.

Skriv alltid på norsk. Vær:
- Profesjonell men vennlig
- Konkret om hva som ble gjort
- Kort og presis (maks 200 ord)
- Inkluder neste steg hvis relevant

Format:
- Ingen "Hei [navn]" - vi vet ikke alltid kundens navn
- Start direkte med takk for henvendelsen eller status
- Avslutt med kontaktinfo

Eksempel på god email:
"Takk for henvendelsen. Vi har nå oppdatert alle plugins på nettsiden deres og ryddet cachen.

Endringer utført:
- 5 plugins oppdatert til nyeste versjon
- Cache tømt for å sikre at endringene vises

Alt ser ut til å fungere som normalt. Ta gjerne kontakt hvis du opplever noe uventet.

Med vennlig hilsen,
[Byrånavn]"
`;

export async function runClientResponder(
  taskId: string,
): Promise<{ success: boolean; emailSent?: boolean; error?: string }> {
  console.log(`[CLIENT-RESPONDER] Processing task: ${taskId}`);

  // Get task with related data
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(
      `
      *,
      customer:customers(id, name, email, billing_email),
      source_email:emails(id, from_email, from_name, gmail_thread_id)
    `,
    )
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return { success: false, error: "Task not found" };
  }

  // Only respond to completed tasks
  if (task.status !== "completed") {
    return { success: false, error: `Task is not completed (status: ${task.status})` };
  }

  // Determine recipient
  let recipientEmail: string | null = null;
  let threadId: string | null = null;

  // Try to get email from source email first (for replies)
  if (task.source_email) {
    recipientEmail = task.source_email.from_email;
    threadId = task.source_email.gmail_thread_id;
  } else if (task.customer?.email) {
    recipientEmail = task.customer.email;
  } else if (task.customer?.billing_email) {
    recipientEmail = task.customer.billing_email;
  }

  if (!recipientEmail) {
    console.log("[CLIENT-RESPONDER] No recipient email found, skipping");
    return { success: true, emailSent: false, error: "No recipient email" };
  }

  // Get agency info
  const { data: agency } = await supabase
    .from("agencies")
    .select("name")
    .eq("id", task.agency_id)
    .single();

  // Build execution summary
  const executionLog = (task.execution_log as StepResult[]) || [];
  const completedSteps = executionLog
    .filter((s) => s.status === "completed")
    .map((s) => `- Steg ${s.step_number}: ${s.output?.slice(0, 100) || "Fullført"}`)
    .join("\n");

  const userMessage = `Skriv en svar-email til kunde for denne oppgaven:

Oppgave: ${task.title}
Beskrivelse: ${task.description}

Utførte steg:
${completedSteps || "Oppgaven ble utført uten spesifikke steg logget."}

Timer brukt: ${task.hours_spent || "Ikke registrert"}

Avsender (byrå): ${agency?.name || "Webbyå"}

VIKTIG: Skriv kun selve email-innholdet, ingen "Subject:" eller lignende.`;

  const startedAt = new Date().toISOString();

  let emailBody: string;
  try {
    emailBody = await callClaude(SYSTEM_PROMPT, userMessage, { maxTokens: 1024 });
  } catch (error) {
    console.error("[CLIENT-RESPONDER] Failed to generate email:", error);
    return { success: false, error: "Failed to generate email" };
  }

  // Format as HTML
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      ${emailBody.split("\n").map((line) => (line.trim() ? `<p>${line}</p>` : "")).join("")}
    </div>
  `;

  // Try to send email via Gmail
  let emailSent = false;
  try {
    const gmail = await getGmailClient(task.agency_id);
    if (gmail) {
      const subject = threadId
        ? `Re: ${task.title}`
        : `Oppdatering: ${task.title}`;

      const messageId = await sendEmail(
        gmail,
        recipientEmail,
        subject,
        htmlBody,
        threadId || undefined,
      );

      if (messageId) {
        emailSent = true;
        console.log(`[CLIENT-RESPONDER] Email sent: ${messageId}`);
      }
    } else {
      console.log("[CLIENT-RESPONDER] No Gmail client available");
    }
  } catch (emailError) {
    console.error("[CLIENT-RESPONDER] Failed to send email:", emailError);
  }

  // Update task
  await supabase
    .from("tasks")
    .update({
      client_notified_at: emailSent ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  // Log agent execution
  await supabase.from("agent_executions").insert({
    agency_id: task.agency_id,
    agent_name: "client-responder",
    task_id: taskId,
    status: "completed",
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    input_data: { taskId, recipientEmail },
    output_data: { emailBody, emailSent },
  });

  return { success: true, emailSent };
}
