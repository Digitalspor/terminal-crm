import { supabase } from "./supabase.js";

export type AgentName =
  | "email-analyzer"
  | "task-planner"
  | "task-executor"
  | "client-responder"
  | "invoice-drafter";

export type LogStatus = "started" | "success" | "error" | "warning";

export interface LogOptions {
  agencyId?: string;
  taskId?: string;
  emailId?: string;
  inputSummary?: string;
  outputSummary?: string;
  tokensUsed?: number;
  metadata?: Record<string, unknown>;
}

export interface AgentLogger {
  start: (message?: string) => Promise<string>;
  success: (message?: string, outputSummary?: string) => Promise<void>;
  error: (error: Error | string, message?: string) => Promise<void>;
  warning: (message: string) => Promise<void>;
}

export function createAgentLogger(
  agentName: AgentName,
  options: LogOptions = {}
): AgentLogger {
  let logId: string | null = null;
  let startTime: number = Date.now();

  const log = async (
    status: LogStatus,
    message?: string,
    extra: Partial<LogOptions & { errorMessage?: string; errorStack?: string }> = {}
  ): Promise<string | null> => {
    const durationMs = status !== "started" ? Date.now() - startTime : undefined;

    const { data, error } = await supabase
      .from("agent_logs")
      .insert({
        agency_id: options.agencyId || null,
        agent_name: agentName,
        task_id: options.taskId || null,
        email_id: options.emailId || null,
        status,
        message,
        input_summary: extra.inputSummary || options.inputSummary,
        output_summary: extra.outputSummary || options.outputSummary,
        error_message: extra.errorMessage,
        error_stack: extra.errorStack,
        duration_ms: durationMs,
        tokens_used: extra.tokensUsed || options.tokensUsed,
        metadata: { ...options.metadata, ...extra.metadata },
      })
      .select("id")
      .single();

    if (error) {
      console.error(`[Logger] Failed to log ${status}:`, error);
      return null;
    }

    // Also log to console for local development
    const prefix = `[${agentName}]`;
    const duration = durationMs ? ` (${durationMs}ms)` : "";
    
    switch (status) {
      case "started":
        console.log(`${prefix} Started${message ? `: ${message}` : ""}`);
        break;
      case "success":
        console.log(`${prefix} ✓ Success${duration}${message ? `: ${message}` : ""}`);
        break;
      case "error":
        console.error(`${prefix} ✗ Error${duration}: ${extra.errorMessage || message}`);
        break;
      case "warning":
        console.warn(`${prefix} ⚠ Warning: ${message}`);
        break;
    }

    return data?.id || null;
  };

  const createAlert = async (
    logId: string,
    severity: "low" | "medium" | "high" | "critical",
    title: string,
    description?: string
  ) => {
    const { error } = await supabase.from("agent_alerts").insert({
      agency_id: options.agencyId || null,
      log_id: logId,
      severity,
      title,
      description,
    });

    if (error) {
      console.error("[Logger] Failed to create alert:", error);
    }
  };

  return {
    start: async (message?: string) => {
      startTime = Date.now();
      const id = await log("started", message);
      logId = id;
      return id || "";
    },

    success: async (message?: string, outputSummary?: string) => {
      await log("success", message, { outputSummary });
    },

    error: async (error: Error | string, message?: string) => {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorStack = error instanceof Error ? error.stack : undefined;

      const id = await log("error", message, { errorMessage, errorStack });

      // Create alert for errors
      if (id) {
        await createAlert(
          id,
          "high",
          `${agentName} failed`,
          errorMessage
        );
      }
    },

    warning: async (message: string) => {
      await log("warning", message);
    },
  };
}

// Quick helper for simple logging without creating a logger instance
export async function logAgentEvent(
  agentName: AgentName,
  status: LogStatus,
  message: string,
  options: LogOptions = {}
) {
  const logger = createAgentLogger(agentName, options);
  
  switch (status) {
    case "started":
      return logger.start(message);
    case "success":
      return logger.success(message);
    case "error":
      return logger.error(message);
    case "warning":
      return logger.warning(message);
  }
}
