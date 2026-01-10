import { callClaudeJSON } from "../core/anthropic.js";
import { supabase } from "../core/supabase.js";

interface PlanStep {
  step_number: number;
  title: string;
  description: string;
  type: "manual" | "wp-cli" | "api" | "ssh" | "verification";
  estimated_minutes: number;
  commands?: string[];
  requires_approval?: boolean;
}

interface TaskPlan {
  summary: string;
  total_estimated_hours: number;
  hourly_rate_suggestion: number;
  steps: PlanStep[];
  risks: string[];
  prerequisites: string[];
  success_criteria: string[];
}

const SYSTEM_PROMPT = `Du er en teknisk planleggings-agent for et web-byrå som jobber med WordPress og Kinsta hosting.

Din jobb er å lage detaljerte, utførbare planer for oppgaver. Planene skal kunne utføres av en annen agent via WP-CLI og SSH.

Returner ALLTID valid JSON med følgende struktur:
{
  "summary": "Kort oppsummering av planen",
  "total_estimated_hours": 1.5,
  "hourly_rate_suggestion": 1250,
  "steps": [
    {
      "step_number": 1,
      "title": "Backup av nettsted",
      "description": "Tar full backup før endringer",
      "type": "wp-cli",
      "estimated_minutes": 5,
      "commands": ["wp db export backup.sql", "wp media regenerate --yes"]
    }
  ],
  "risks": ["Risiko 1", "Risiko 2"],
  "prerequisites": ["Hva må være på plass"],
  "success_criteria": ["Hvordan vet vi at det fungerer"]
}

Step types:
- "wp-cli": WordPress CLI kommandoer (kan kjøres automatisk)
- "ssh": Shell-kommandoer på server
- "api": API-kall (Vercel, Supabase, etc.)
- "manual": Krever manuell handling (skriv detaljerte instruksjoner)
- "verification": Sjekk/test (tar screenshots)

Regler:
1. ALLTID start med backup for destruktive operasjoner
2. ALLTID inkluder verifikasjonssteg
3. Estimer realistisk tid (inkluder feilsøking)
4. Standard timepris: 1250 NOK/time for support, 1500 for utvikling
5. For WordPress: Bruk WP-CLI når mulig
6. Skriv kommandoer som kan copy-pastes direkte

Vanlige WP-CLI kommandoer:
- wp plugin update --all
- wp core update
- wp theme update --all
- wp cache flush
- wp rewrite flush
- wp search-replace 'old' 'new' --dry-run
- wp db export
- wp media regenerate
`;

export async function runTaskPlanner(
  taskId: string,
): Promise<{ success: boolean; error?: string }> {
  console.log(`[TASK-PLANNER] Planning task: ${taskId}`);

  // Get task from database
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(
      `
      *,
      customer:customers(
        id, name, wordpress_url, wordpress_admin_user, 
        kinsta_site_id, kinsta_environment
      )
    `,
    )
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return { success: false, error: "Task not found" };
  }

  // Don't re-plan if already planned
  if (task.status !== "new") {
    console.log(`[TASK-PLANNER] Task ${taskId} is not in 'new' status, skipping`);
    return { success: false, error: "Task already planned" };
  }

  const customerContext = task.customer
    ? `
Kunde: ${task.customer.name}
WordPress URL: ${task.customer.wordpress_url || "Ikke satt"}
Kinsta Site ID: ${task.customer.kinsta_site_id || "Ikke satt"}
Kinsta Environment: ${task.customer.kinsta_environment || "live"}
`
    : "Ingen kunde tilknyttet";

  const userMessage = `Lag en detaljert plan for denne oppgaven:

Tittel: ${task.title}
Kategori: ${task.category || "Ikke satt"}
Prioritet: ${task.priority || "medium"}

Beskrivelse:
${task.description}

---
${customerContext}

Lag en plan med konkrete steg som kan utføres. Inkluder WP-CLI kommandoer der det er relevant.`;

  let plan: TaskPlan;
  const startedAt = new Date().toISOString();

  try {
    plan = await callClaudeJSON<TaskPlan>(SYSTEM_PROMPT, userMessage, {
      maxTokens: 4096,
    });
  } catch (parseError) {
    console.error("[TASK-PLANNER] Failed to parse Claude response:", parseError);

    await supabase.from("agent_executions").insert({
      agency_id: task.agency_id,
      agent_name: "task-planner",
      task_id: taskId,
      status: "failed",
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      error_message: "Failed to generate plan",
    });

    return { success: false, error: "Planning failed" };
  }

  // Update task with plan
  await supabase
    .from("tasks")
    .update({
      status: "planned",
      plan_json: plan,
      estimated_hours: plan.total_estimated_hours,
      hourly_rate: plan.hourly_rate_suggestion,
    })
    .eq("id", taskId);

  // Log agent execution
  await supabase.from("agent_executions").insert({
    agency_id: task.agency_id,
    agent_name: "task-planner",
    task_id: taskId,
    status: "completed",
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    input_data: { taskId, title: task.title },
    output_data: { plan },
  });

  console.log(`[TASK-PLANNER] Plan created for task: ${taskId}`);
  return { success: true };
}
