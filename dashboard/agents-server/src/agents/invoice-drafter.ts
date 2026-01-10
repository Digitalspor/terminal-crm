import { supabase } from "../core/supabase.js";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface InvoiceDraft {
  customer_id: string;
  agency_id: string;
  task_ids: string[];
  line_items: LineItem[];
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  currency: string;
  billing_system: string;
  invoice_date: string;
  due_date: string;
  notes: string;
}

const VAT_RATE = 25; // Norwegian standard VAT
const DEFAULT_HOURLY_RATE = 1250;

export async function runInvoiceDrafter(
  taskId: string,
): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
  console.log(`[INVOICE-DRAFTER] Processing task: ${taskId}`);

  // Get task with customer and agency info
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(
      `
      *,
      customer:customers(id, name, org_number, billing_email),
      agency:agencies(id, name, billing_system)
    `,
    )
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return { success: false, error: "Task not found" };
  }

  // Only create invoice for completed tasks with hours
  if (task.status !== "completed") {
    return { success: false, error: `Task is not completed (status: ${task.status})` };
  }

  if (!task.customer) {
    return { success: false, error: "No customer associated with task" };
  }

  // Check if invoice already exists for this task
  const { data: existingInvoice } = await supabase
    .from("invoice_drafts")
    .select("id")
    .contains("task_ids", [taskId])
    .single();

  if (existingInvoice) {
    console.log(`[INVOICE-DRAFTER] Invoice already exists for task: ${taskId}`);
    return { success: true, invoiceId: existingInvoice.id };
  }

  // Get time entries for this task
  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*")
    .eq("task_id", taskId);

  // Calculate hours
  let totalHours = task.hours_spent || 0;
  if (timeEntries && timeEntries.length > 0) {
    totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  }

  if (totalHours === 0) {
    console.log(`[INVOICE-DRAFTER] No hours logged for task: ${taskId}`);
    return { success: false, error: "No hours logged" };
  }

  const hourlyRate = task.hourly_rate || DEFAULT_HOURLY_RATE;
  const startedAt = new Date().toISOString();

  // Build line items
  const lineItems: LineItem[] = [
    {
      description: task.title,
      quantity: totalHours,
      unit_price: hourlyRate,
      amount: totalHours * hourlyRate,
    },
  ];

  // Add individual time entries as sub-lines if present
  if (timeEntries && timeEntries.length > 1) {
    lineItems.length = 0; // Clear and rebuild with detailed entries
    for (const entry of timeEntries) {
      lineItems.push({
        description: entry.description || task.title,
        quantity: entry.hours,
        unit_price: hourlyRate,
        amount: entry.hours * hourlyRate,
      });
    }
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = Math.round(subtotal * (VAT_RATE / 100));
  const totalAmount = subtotal + vatAmount;

  // Dates
  const invoiceDate = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]; // 14 days

  // Create invoice draft
  const invoiceDraft: InvoiceDraft = {
    customer_id: task.customer.id,
    agency_id: task.agency_id,
    task_ids: [taskId],
    line_items: lineItems,
    subtotal,
    vat_rate: VAT_RATE,
    vat_amount: vatAmount,
    total_amount: totalAmount,
    currency: "NOK",
    billing_system: task.agency?.billing_system || "fiken",
    invoice_date: invoiceDate,
    due_date: dueDate,
    notes: `Faktura for: ${task.title}`,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("invoice_drafts")
    .insert({
      ...invoiceDraft,
      status: "draft",
    })
    .select()
    .single();

  if (insertError || !inserted) {
    console.error("[INVOICE-DRAFTER] Failed to create invoice:", insertError);
    return { success: false, error: "Failed to create invoice draft" };
  }

  // Update task with invoice reference
  await supabase
    .from("tasks")
    .update({
      status: "invoiced",
      invoice_draft_id: inserted.id,
    })
    .eq("id", taskId);

  // Log agent execution
  await supabase.from("agent_executions").insert({
    agency_id: task.agency_id,
    agent_name: "invoice-drafter",
    task_id: taskId,
    status: "completed",
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    input_data: { taskId, hours: totalHours, hourlyRate },
    output_data: {
      invoiceId: inserted.id,
      totalAmount,
      lineItemCount: lineItems.length,
    },
  });

  console.log(`[INVOICE-DRAFTER] Invoice created: ${inserted.id}`);
  return { success: true, invoiceId: inserted.id };
}
