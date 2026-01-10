import { supabase } from "../core/supabase.js";
import {
  executeMultipleCommands,
  executeWPCLI,
  getCustomerSSHCredentials,
} from "../tools/ssh.js";

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

interface StepResult {
  step_number: number;
  status: "completed" | "failed" | "skipped";
  output?: string;
  error?: string;
  executed_at: string;
}

export async function runTaskExecutor(
  taskId: string,
): Promise<{ success: boolean; results?: StepResult[]; error?: string }> {
  console.log(`[TASK-EXECUTOR] Executing task: ${taskId}`);

  // Get task from database
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(
      `
      *,
      customer:customers(
        id, name, kinsta_site_id, kinsta_environment
      )
    `,
    )
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return { success: false, error: "Task not found" };
  }

  // Only execute approved tasks
  if (task.status !== "approved") {
    return {
      success: false,
      error: `Task is not approved (status: ${task.status})`,
    };
  }

  const plan = task.plan_json as TaskPlan | null;
  if (!plan || !plan.steps || plan.steps.length === 0) {
    return { success: false, error: "No plan found for task" };
  }

  // Get SSH credentials if customer has Kinsta
  let sshCredentials = null;
  if (task.customer?.kinsta_site_id) {
    sshCredentials = await getCustomerSSHCredentials(task.customer.id);
  }

  const startedAt = new Date().toISOString();
  const stepResults: StepResult[] = [];
  let overallSuccess = true;

  // Update task status to in_progress
  await supabase
    .from("tasks")
    .update({ status: "in_progress" })
    .eq("id", taskId);

  for (const step of plan.steps) {
    console.log(`[TASK-EXECUTOR] Step ${step.step_number}: ${step.title}`);

    const stepResult: StepResult = {
      step_number: step.step_number,
      status: "completed",
      executed_at: new Date().toISOString(),
    };

    try {
      switch (step.type) {
        case "wp-cli":
        case "ssh":
          if (!sshCredentials) {
            stepResult.status = "skipped";
            stepResult.error = "No SSH credentials available";
            break;
          }

          if (step.commands && step.commands.length > 0) {
            const { results, allSucceeded } = await executeMultipleCommands(
              sshCredentials,
              step.commands,
            );

            stepResult.output = results
              .map((r, i) => `Command ${i + 1}:\n${r.output}`)
              .join("\n\n");

            if (!allSucceeded) {
              stepResult.status = "failed";
              stepResult.error = results.find((r) => !r.success)?.error;
              overallSuccess = false;
            }
          }
          break;

        case "verification":
          // For now, mark verification as completed
          // TODO: Implement Playwright screenshots
          if (sshCredentials && step.commands) {
            const { results, allSucceeded } = await executeMultipleCommands(
              sshCredentials,
              step.commands,
            );
            stepResult.output = results.map((r) => r.output).join("\n");
            if (!allSucceeded) {
              stepResult.status = "failed";
              stepResult.error = "Verification failed";
            }
          } else {
            stepResult.output = "Verification step (manual check required)";
          }
          break;

        case "manual":
          stepResult.status = "skipped";
          stepResult.output = `Manual step: ${step.description}`;
          break;

        case "api":
          // TODO: Implement API calls (Vercel, Supabase, etc.)
          stepResult.status = "skipped";
          stepResult.output = "API step not yet implemented";
          break;

        default:
          stepResult.status = "skipped";
          stepResult.output = `Unknown step type: ${step.type}`;
      }
    } catch (error: unknown) {
      stepResult.status = "failed";
      stepResult.error = error instanceof Error ? error.message : "Unknown error";
      overallSuccess = false;
    }

    stepResults.push(stepResult);

    // Stop execution if a critical step fails
    if (stepResult.status === "failed" && step.type !== "verification") {
      break;
    }
  }

  // Calculate actual hours spent (rough estimate based on steps)
  const hoursSpent = plan.total_estimated_hours;

  // Update task with execution results
  await supabase
    .from("tasks")
    .update({
      status: overallSuccess ? "completed" : "failed",
      executed_at: new Date().toISOString(),
      execution_log: stepResults,
      hours_spent: hoursSpent,
    })
    .eq("id", taskId);

  // Log agent execution
  await supabase.from("agent_executions").insert({
    agency_id: task.agency_id,
    agent_name: "task-executor",
    task_id: taskId,
    status: overallSuccess ? "completed" : "failed",
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    input_data: { taskId, planSteps: plan.steps.length },
    output_data: {
      results: stepResults,
      overallSuccess,
      hoursSpent,
    },
  });

  console.log(
    `[TASK-EXECUTOR] Task ${taskId} ${overallSuccess ? "completed" : "failed"}`,
  );

  return { success: overallSuccess, results: stepResults };
}
