import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CRMDatabase {
  constructor(dbPath = './data/crm.db') {
    this.dbPath = path.resolve(dbPath);
    this.db = null;
  }

  connect() {
    if (this.db) return this.db;

    // Ensure data directory exists
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.initSchema();
    return this.db;
  }

  initSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    const tableExists = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'")
      .get();

    if (!tableExists) {
      this.db.exec(schema);
      console.log('✓ Database schema initialized');
    }
  }

  // ============================================
  // CUSTOMER QUERIES
  // ============================================

  getAllCustomers() {
    return this.db.prepare(`
      SELECT * FROM customers
      ORDER BY name ASC
    `).all();
  }

  getCustomer(id) {
    return this.db.prepare(`
      SELECT * FROM customers WHERE id = ?
    `).get(id);
  }

  searchCustomers(query) {
    if (!query || query.trim().length === 0) {
      return this.getAllCustomers();
    }

    // Use FTS5 for full-text search
    return this.db.prepare(`
      SELECT c.*
      FROM customers c
      JOIN customers_fts fts ON c.rowid = fts.rowid
      WHERE customers_fts MATCH ?
      ORDER BY rank
    `).all(query);
  }

  insertCustomer(customer) {
    const stmt = this.db.prepare(`
      INSERT INTO customers (
        id, name, org_nr, contact_name, contact_email, contact_phone,
        address_street, address_postal_code, address_city, fiken_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      customer.id,
      customer.name,
      customer.org_nr || null,
      customer.contact_name || null,
      customer.contact_email || null,
      customer.contact_phone || null,
      customer.address_street || null,
      customer.address_postal_code || null,
      customer.address_city || null,
      customer.fiken_id || null,
      customer.notes || null
    );

    return info.lastInsertRowid;
  }

  updateCustomer(id, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return 0;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE customers
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    const info = stmt.run(...values);
    return info.changes;
  }

  insertCustomersBatch(customers) {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO customers (
        id, name, org_nr, contact_name, contact_email, contact_phone,
        address_street, address_postal_code, address_city, fiken_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((customers) => {
      for (const customer of customers) {
        insert.run(
          customer.id,
          customer.name,
          customer.org_nr || null,
          customer.contact_name || null,
          customer.contact_email || null,
          customer.contact_phone || null,
          customer.address_street || null,
          customer.address_postal_code || null,
          customer.address_city || null,
          customer.fiken_id || null,
          customer.notes || null
        );
      }
    });

    insertMany(customers);
  }

  // ============================================
  // INVOICE QUERIES
  // ============================================

  getAllInvoices() {
    return this.db.prepare(`
      SELECT
        i.*,
        c.name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.invoice_number DESC
    `).all();
  }

  getInvoice(id) {
    const invoice = this.db.prepare(`
      SELECT
        i.*,
        c.name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.id = ?
    `).get(id);

    if (invoice) {
      invoice.items = this.getInvoiceItems(id);
    }

    return invoice;
  }

  getInvoiceItems(invoiceId) {
    return this.db.prepare(`
      SELECT * FROM invoice_items
      WHERE invoice_id = ?
      ORDER BY id ASC
    `).all(invoiceId);
  }

  getInvoicesByCustomer(customerId) {
    return this.db.prepare(`
      SELECT
        i.*,
        c.name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.customer_id = ?
      ORDER BY i.invoice_number DESC
    `).all(customerId);
  }

  getOverdueInvoices() {
    return this.db.prepare(`
      SELECT
        i.*,
        c.name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.status != 'paid'
        AND i.due_date < date('now')
      ORDER BY i.due_date ASC
    `).all();
  }

  searchInvoices(query) {
    if (!query || query.trim().length === 0) {
      return this.getAllInvoices();
    }

    // Use FTS5 for full-text search
    return this.db.prepare(`
      SELECT
        i.*,
        c.name as customer_name
      FROM invoices i
      JOIN invoices_fts fts ON i.rowid = fts.rowid
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE invoices_fts MATCH ?
      ORDER BY rank
    `).all(query);
  }

  insertInvoice(invoice) {
    const stmt = this.db.prepare(`
      INSERT INTO invoices (
        id, customer_id, invoice_number, date, due_date, status,
        subtotal, vat, total, fiken_id, fiken_synced, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const invoiceId = invoice.id || String(Date.now()); // Generate ID if not provided

    stmt.run(
      invoiceId,
      invoice.customer_id,
      invoice.invoice_number || null,
      invoice.date || null,
      invoice.due_date || null,
      invoice.status || 'draft',
      invoice.subtotal || 0,
      invoice.vat || 0,
      invoice.total || 0,
      invoice.fiken_id || null,
      invoice.fiken_synced || 0,
      invoice.notes || null
    );

    return invoiceId;
  }

  insertInvoiceItem(invoiceId, item) {
    const stmt = this.db.prepare(`
      INSERT INTO invoice_items (
        invoice_id, description, hours, rate, amount
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      invoiceId,
      item.description || null,
      item.hours || null,
      item.rate || null,
      item.amount || 0
    );

    return info.lastInsertRowid;
  }

  insertInvoicesBatch(invoices) {
    const insertInvoice = this.db.prepare(`
      INSERT OR REPLACE INTO invoices (
        id, customer_id, invoice_number, date, due_date, status,
        subtotal, vat, total, fiken_id, fiken_synced, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = this.db.prepare(`
      INSERT INTO invoice_items (
        invoice_id, description, hours, rate, amount
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((invoices) => {
      for (const invoice of invoices) {
        insertInvoice.run(
          invoice.id,
          invoice.customer_id,
          invoice.invoice_number || null,
          invoice.date || null,
          invoice.due_date || null,
          invoice.status || 'draft',
          invoice.subtotal || 0,
          invoice.vat || 0,
          invoice.total || 0,
          invoice.fiken_id || null,
          invoice.fiken_synced || 0,
          invoice.notes || null
        );

        if (invoice.items && invoice.items.length > 0) {
          for (const item of invoice.items) {
            insertItem.run(
              invoice.id,
              item.description || null,
              item.hours || null,
              item.rate || null,
              item.amount || 0
            );
          }
        }
      }
    });

    insertMany(invoices);
  }

  // ============================================
  // PROJECT QUERIES
  // ============================================

  getAllProjects() {
    return this.db.prepare(`
      SELECT
        p.*,
        c.name as customer_name
      FROM projects p
      LEFT JOIN customers c ON p.customer_id = c.id
      ORDER BY p.created_at DESC
    `).all();
  }

  getProject(id) {
    return this.db.prepare(`
      SELECT
        p.*,
        c.name as customer_name
      FROM projects p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
    `).get(id);
  }

  getProjectsByCustomer(customerId) {
    return this.db.prepare(`
      SELECT * FROM projects
      WHERE customer_id = ?
      ORDER BY created_at DESC
    `).all(customerId);
  }

  insertProject(project) {
    const stmt = this.db.prepare(`
      INSERT INTO projects (
        id, customer_id, name, description, status,
        start_date, deadline, estimated_hours, spent_hours, hourly_rate,
        budget, team, tags, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const projectId = project.id || String(Date.now());

    stmt.run(
      projectId,
      project.customer_id,
      project.name,
      project.description || null,
      project.status || 'in-progress',
      project.start_date || null,
      project.deadline || null,
      project.estimated_hours || null,
      project.spent_hours || 0,
      project.hourly_rate || null,
      project.budget || null,
      project.team || null,
      project.tags || null,
      project.notes || null
    );

    return projectId;
  }

  insertProjectsBatch(projects) {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO projects (
        id, customer_id, name, description, status,
        start_date, deadline, estimated_hours, spent_hours, hourly_rate,
        budget, team, tags, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((projects) => {
      for (const project of projects) {
        insert.run(
          project.id,
          project.customer_id,
          project.name,
          project.description || null,
          project.status || 'in-progress',
          project.start_date || null,
          project.deadline || null,
          project.estimated_hours || null,
          project.spent_hours || 0,
          project.hourly_rate || null,
          project.budget || null,
          project.team || null,
          project.tags || null,
          project.notes || null
        );
      }
    });

    insertMany(projects);
  }

  // ============================================
  // EXPENSE QUERIES
  // ============================================

  getAllExpenses() {
    return this.db.prepare(`
      SELECT * FROM expenses
      ORDER BY date DESC
    `).all();
  }

  getExpense(id) {
    return this.db.prepare(`
      SELECT * FROM expenses WHERE id = ?
    `).get(id);
  }

  getExpensesByDateRange(startDate, endDate) {
    return this.db.prepare(`
      SELECT * FROM expenses
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
    `).all(startDate, endDate);
  }

  getExpensesByCategory(category) {
    return this.db.prepare(`
      SELECT * FROM expenses
      WHERE category = ?
      ORDER BY date DESC
    `).all(category);
  }

  insertExpense(expense) {
    const stmt = this.db.prepare(`
      INSERT INTO expenses (
        id, date, description, category, amount, receipt_file, receipt_number, vendor, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const expenseId = expense.id || String(Date.now());

    stmt.run(
      expenseId,
      expense.date,
      expense.description || null,
      expense.category || null,
      expense.amount,
      expense.receipt_file || null,
      expense.receipt_number || null,
      expense.vendor || null,
      expense.notes || null
    );

    return expenseId;
  }

  insertExpensesBatch(expenses) {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO expenses (
        id, date, description, category, amount, receipt_file, receipt_number, vendor, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((expenses) => {
      for (const expense of expenses) {
        insert.run(
          expense.id,
          expense.date,
          expense.description || null,
          expense.category || null,
          expense.amount,
          expense.receipt_file || null,
          expense.receipt_number || null,
          expense.vendor || null,
          expense.notes || null
        );
      }
    });

    insertMany(expenses);
  }

  // ============================================
  // STATS QUERIES
  // ============================================

  getMonthlyRevenue(year, month) {
    return this.db.prepare(`
      SELECT
        SUM(total) as total_revenue,
        COUNT(*) as invoice_count,
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as paid_revenue,
        SUM(CASE WHEN status = 'sent' THEN total ELSE 0 END) as outstanding
      FROM invoices
      WHERE strftime('%Y', date) = ?
        AND strftime('%m', date) = ?
    `).get(year.toString(), month.toString().padStart(2, '0'));
  }

  getYearlyRevenue(year) {
    return this.db.prepare(`
      SELECT
        strftime('%m', date) as month,
        SUM(total) as revenue,
        COUNT(*) as invoice_count
      FROM invoices
      WHERE strftime('%Y', date) = ?
      GROUP BY month
      ORDER BY month
    `).all(year.toString());
  }

  getRevenueByCustomer(limit = 10) {
    return this.db.prepare(`
      SELECT
        c.id,
        c.name,
        SUM(i.total) as total_revenue,
        COUNT(i.id) as invoice_count
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
      GROUP BY c.id
      ORDER BY total_revenue DESC
      LIMIT ?
    `).all(limit);
  }

  getOverallStats() {
    const stats = this.db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM invoices) as total_invoices,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT SUM(total) FROM invoices WHERE status = 'paid') as total_revenue,
        (SELECT SUM(total) FROM invoices WHERE status = 'sent') as outstanding_invoices,
        (SELECT COUNT(*) FROM invoices WHERE status != 'paid' AND due_date < date('now')) as overdue_count
    `).get();

    return stats;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  vacuum() {
    this.db.exec('VACUUM');
  }

  backup(backupPath) {
    return this.db.backup(backupPath);
  }
}

// Export singleton instance
export const db = new CRMDatabase();
db.connect();

// Also export the class for testing
export { CRMDatabase };
