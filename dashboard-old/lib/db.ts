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
      (SELECT COUNT(*) FROM customers) as total_customers,
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

  const customers = db.prepare(`
    SELECT
      c.*,
      (SELECT COUNT(*) FROM invoices WHERE customer_id = c.id) as invoice_count,
      (SELECT SUM(total) FROM invoices WHERE customer_id = c.id AND status = 'paid') as total_revenue
    FROM customers c
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
