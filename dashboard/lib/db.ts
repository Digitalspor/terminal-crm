import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), '..', 'data', 'crm.db')

export function getDb() {
  return new Database(dbPath, { readonly: true })
}

export function getStats() {
  const db = getDb()

  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(DISTINCT c.id) FROM customers c WHERE EXISTS (SELECT 1 FROM invoices WHERE customer_id = c.id)) as total_customers,
      (SELECT COUNT(*) FROM invoices) as total_invoices,
      (SELECT COUNT(*) FROM projects) as total_projects,
      (SELECT SUM(total) FROM invoices WHERE status = 'paid') as total_revenue,
      (SELECT SUM(total) FROM invoices WHERE status = 'sent') as outstanding,
      (SELECT COUNT(*) FROM invoices WHERE status <> 'paid' AND due_date < date('now')) as overdue_count
  `).get() as any

  db.close()
  return stats
}

export function getCustomers(limit = 100) {
  const db = getDb()

  // Only return customers who have invoices (not suppliers)
  const customers = db.prepare(`
    SELECT
      c.*,
      (SELECT COUNT(*) FROM invoices WHERE customer_id = c.id) as invoice_count,
      (SELECT SUM(total) FROM invoices WHERE customer_id = c.id AND status = 'paid') as total_revenue
    FROM customers c
    WHERE EXISTS (SELECT 1 FROM invoices WHERE customer_id = c.id)
    ORDER BY c.name
    LIMIT ?
  `).all(limit)

  db.close()
  return customers
}

export function getCustomer(id: string) {
  const db = getDb()

  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id)

  const invoices = db.prepare(`
    SELECT * FROM invoices
    WHERE customer_id = ?
    ORDER BY date DESC
  `).all(id)

  db.close()
  return { customer, invoices }
}

export function getInvoices(limit = 100) {
  const db = getDb()

  const invoices = db.prepare(`
    SELECT
      i.*,
      c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    ORDER BY i.date DESC
    LIMIT ?
  `).all(limit)

  db.close()
  return invoices
}

export function getOverdueInvoices() {
  const db = getDb()

  const invoices = db.prepare(`
    SELECT
      i.*,
      c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.status <> 'paid' AND i.due_date < date('now')
    ORDER BY i.due_date ASC
  `).all()

  db.close()
  return invoices
}

export function getTasks(limit = 50) {
  const db = getDb()

  const tasks = db.prepare(`
    SELECT
      t.*,
      c.name as customer_name
    FROM tasks t
    LEFT JOIN customers c ON t.customer_id = c.id
    ORDER BY t.due_date ASC
    LIMIT ?
  `).all(limit)

  db.close()
  return tasks
}

export function getProjects(limit = 100) {
  const db = getDb()

  const projects = db.prepare(`
    SELECT
      p.*,
      c.name as customer_name
    FROM projects p
    LEFT JOIN customers c ON p.customer_id = c.id
    ORDER BY p.created_at DESC
    LIMIT ?
  `).all(limit)

  db.close()
  return projects
}

export function getLeads(limit = 100) {
  const db = getDb()

  const leads = db.prepare(`
    SELECT * FROM leads
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit)

  db.close()
  return leads
}

export function createLead(lead: {
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  status?: string;
  source?: string;
  estimated_value?: number;
  notes?: string;
}) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const id = `lead-${Date.now()}`

  db.prepare(`
    INSERT INTO leads (id, company_name, contact_name, contact_email, status, source, estimated_value, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    lead.company_name,
    lead.contact_name || null,
    lead.contact_email || null,
    lead.status || 'new',
    lead.source || null,
    lead.estimated_value || null,
    lead.notes || null
  )

  db.close()
  return { id, ...lead }
}

export function deleteLead(id: string) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id)
  db.close()
  return result.changes > 0
}

export function updateLeadStatus(id: string, status: string) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const result = db.prepare('UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id)
  db.close()
  return result.changes > 0
}

export function createProject(project: {
  customer_id: string;
  name: string;
  description?: string;
  status?: string;
  deadline?: string;
  estimated_hours?: number;
  budget?: number;
}) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const id = `proj-${Date.now()}`

  db.prepare(`
    INSERT INTO projects (id, customer_id, name, description, status, deadline, estimated_hours, budget)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    project.customer_id,
    project.name,
    project.description || null,
    project.status || 'in-progress',
    project.deadline || null,
    project.estimated_hours || null,
    project.budget || null
  )

  db.close()
  return { id, ...project }
}

export function deleteProject(id: string) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  db.close()
  return result.changes > 0
}

export function updateProjectStatus(id: string, status: string) {
  const db = new (require('better-sqlite3'))(require('path').join(process.cwd(), '..', 'data', 'crm.db'))
  const result = db.prepare('UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id)
  db.close()
  return result.changes > 0
}

export function getEconomyStats(startDate?: string, endDate?: string) {
  const db = getDb()

  // Default to all time if no dates provided
  const dateFilter = startDate && endDate
    ? `date >= '${startDate}' AND date <= '${endDate}'`
    : '1=1'

  const stats = db.prepare(`
    SELECT
      (SELECT SUM(total) FROM invoices WHERE status = 'paid' AND ${dateFilter}) as total_paid,
      (SELECT SUM(total) FROM invoices WHERE status = 'sent' AND ${dateFilter}) as total_outstanding,
      (SELECT COUNT(*) FROM invoices WHERE status = 'sent' AND ${dateFilter}) as invoice_count,
      (SELECT SUM(total) FROM invoices WHERE status = 'draft' AND ${dateFilter}) as total_draft,
      (SELECT COUNT(*) FROM invoices WHERE status <> 'paid' AND due_date < date('now') AND ${dateFilter}) as overdue_count,
      (SELECT SUM(total) FROM invoices WHERE status <> 'paid' AND due_date < date('now') AND ${dateFilter}) as overdue_amount,
      (SELECT SUM(total) FROM invoices WHERE ${dateFilter}) as invoiced_period,
      (SELECT SUM(total) FROM invoices WHERE status = 'paid' AND ${dateFilter}) as paid_period
  `).get() as any

  db.close()
  return stats
}

export function getInvoicesByPeriod(startDate?: string, endDate?: string, limit = 100) {
  const db = getDb()

  let query = `
    SELECT
      i.*,
      c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
  `

  if (startDate && endDate) {
    query += ` WHERE i.date >= ? AND i.date <= ?`
  }

  query += ` ORDER BY i.date DESC LIMIT ?`

  const invoices = startDate && endDate
    ? db.prepare(query).all(startDate, endDate, limit)
    : db.prepare(query).all(limit)

  db.close()
  return invoices
}
