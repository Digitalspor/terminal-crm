import cors from "cors";
import "dotenv/config";
import express from "express";
import cron from "node-cron";
import { pollEmails } from "./cron/email-poll.js";
import { runEmailAnalyzer } from "./agents/email-analyzer.js";
import { runTaskPlanner } from "./agents/task-planner.js";
import { runTaskExecutor } from "./agents/task-executor.js";
import { runClientResponder } from "./agents/client-responder.js";
import { runInvoiceDrafter } from "./agents/invoice-drafter.js";
import { supabase } from "./core/supabase.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// Agent endpoints
// ============================================

app.post("/api/agents/email-analyzer", async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) {
      return res.status(400).json({ error: "emailId required" });
    }
    const result = await runEmailAnalyzer(emailId);
    res.json(result);
  } catch (error) {
    console.error("Email analyzer error:", error);
    res.status(500).json({ error: "Failed to run email analyzer" });
  }
});

app.post("/api/agents/task-planner", async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "taskId required" });
    }
    const result = await runTaskPlanner(taskId);
    res.json(result);
  } catch (error) {
    console.error("Task planner error:", error);
    res.status(500).json({ error: "Failed to run task planner" });
  }
});

app.post("/api/agents/task-executor", async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "taskId required" });
    }
    const result = await runTaskExecutor(taskId);
    res.json(result);
  } catch (error) {
    console.error("Task executor error:", error);
    res.status(500).json({ error: "Failed to run task executor" });
  }
});

app.post("/api/agents/client-responder", async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "taskId required" });
    }
    const result = await runClientResponder(taskId);
    res.json(result);
  } catch (error) {
    console.error("Client responder error:", error);
    res.status(500).json({ error: "Failed to run client responder" });
  }
});

app.post("/api/agents/invoice-drafter", async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "taskId required" });
    }
    const result = await runInvoiceDrafter(taskId);
    res.json(result);
  } catch (error) {
    console.error("Invoice drafter error:", error);
    res.status(500).json({ error: "Failed to run invoice drafter" });
  }
});

// ============================================
// Gmail endpoints
// ============================================

app.post("/api/gmail/poll", async (req, res) => {
  try {
    const result = await pollEmails();
    res.json(result);
  } catch (error) {
    console.error("Gmail poll error:", error);
    res.status(500).json({ error: "Failed to poll emails" });
  }
});

// ============================================
// Task workflow automation
// ============================================

// Approve a task plan and trigger execution
app.post("/api/tasks/:taskId/approve", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { approvedBy } = req.body;

    // Update task status to approved
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        status: "approved",
        plan_approved_at: new Date().toISOString(),
        plan_approved_by: approvedBy,
      })
      .eq("id", taskId)
      .eq("status", "planned"); // Only approve if in planned status

    if (updateError) {
      return res.status(400).json({ error: "Failed to approve task" });
    }

    // Trigger task executor
    const result = await runTaskExecutor(taskId);

    // If execution succeeded, trigger client responder and invoice drafter
    if (result.success) {
      await runClientResponder(taskId);
      await runInvoiceDrafter(taskId);
    }

    res.json({ approved: true, execution: result });
  } catch (error) {
    console.error("Task approval error:", error);
    res.status(500).json({ error: "Failed to approve and execute task" });
  }
});

// ============================================
// Cron jobs
// ============================================

// Poll emails every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("[CRON] Polling emails...");
  try {
    await pollEmails();
  } catch (error) {
    console.error("[CRON] Email poll failed:", error);
  }
});

// ============================================
// Realtime listeners
// ============================================

async function setupRealtimeListeners() {
  // Listen for new tasks to auto-plan
  supabase
    .channel("tasks-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tasks",
      },
      async (payload) => {
        console.log("[REALTIME] New task created:", payload.new.id);
        try {
          await runTaskPlanner(payload.new.id as string);
        } catch (error) {
          console.error("[REALTIME] Task planner failed:", error);
        }
      },
    )
    .subscribe();

  // Listen for task status changes
  supabase
    .channel("tasks-update")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "tasks",
        filter: "status=eq.completed",
      },
      async (payload) => {
        console.log("[REALTIME] Task completed:", payload.new.id);
        // Auto-trigger client responder and invoice drafter
        try {
          await runClientResponder(payload.new.id as string);
          await runInvoiceDrafter(payload.new.id as string);
        } catch (error) {
          console.error("[REALTIME] Post-completion agents failed:", error);
        }
      },
    )
    .subscribe();

  console.log("[REALTIME] Subscribed to task changes");
}

// ============================================
// Start server
// ============================================

app.listen(PORT, async () => {
  console.log(`🤖 Agent server running on http://localhost:${PORT}`);
  console.log(`
Available endpoints:
  POST /api/agents/email-analyzer   { emailId }
  POST /api/agents/task-planner     { taskId }
  POST /api/agents/task-executor    { taskId }
  POST /api/agents/client-responder { taskId }
  POST /api/agents/invoice-drafter  { taskId }
  POST /api/gmail/poll
  POST /api/tasks/:taskId/approve   { approvedBy }
  `);

  await setupRealtimeListeners();
});
