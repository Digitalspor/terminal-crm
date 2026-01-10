#!/usr/bin/env node

// src/dashboard-ink.js
import React13 from "react";
import { render } from "ink";

// src/App.js
import React12, { useEffect as useEffect8 } from "react";
import { Box as Box11, Text as Text11, useApp } from "ink";

// src/store/index.js
import { create } from "zustand";

// src/db/database.js
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var CRMDatabase = class {
  constructor(dbPath = "./data/crm.db") {
    this.dbPath = path.resolve(dbPath);
    this.db = null;
  }
  connect() {
    if (this.db) return this.db;
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.initSchema();
    return this.db;
  }
  initSchema() {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");
    const tableExists = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'").get();
    if (!tableExists) {
      this.db.exec(schema);
      console.log("\u2713 Database schema initialized");
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
    Object.keys(updates).forEach((key) => {
      if (key !== "id" && updates[key] !== void 0) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    if (fields.length === 0) return 0;
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    const stmt = this.db.prepare(`
      UPDATE customers
      SET ${fields.join(", ")}
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
    const insertMany = this.db.transaction((customers2) => {
      for (const customer of customers2) {
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
    const invoiceId = invoice.id || String(Date.now());
    stmt.run(
      invoiceId,
      invoice.customer_id,
      invoice.invoice_number || null,
      invoice.date || null,
      invoice.due_date || null,
      invoice.status || "draft",
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
    const insertMany = this.db.transaction((invoices2) => {
      for (const invoice of invoices2) {
        insertInvoice.run(
          invoice.id,
          invoice.customer_id,
          invoice.invoice_number || null,
          invoice.date || null,
          invoice.due_date || null,
          invoice.status || "draft",
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
      project.status || "in-progress",
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
    const insertMany = this.db.transaction((projects2) => {
      for (const project of projects2) {
        insert.run(
          project.id,
          project.customer_id,
          project.name,
          project.description || null,
          project.status || "in-progress",
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
    const insertMany = this.db.transaction((expenses2) => {
      for (const expense of expenses2) {
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
    `).get(year.toString(), month.toString().padStart(2, "0"));
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
    this.db.exec("VACUUM");
  }
  backup(backupPath) {
    return this.db.backup(backupPath);
  }
};
var db = new CRMDatabase();
db.connect();

// src/lib/search.js
import Fuse from "fuse.js";
var SearchEngine = class {
  constructor() {
    this.fuseOptions = {
      includeScore: true,
      threshold: 0.4,
      // Lower = more strict, higher = more fuzzy
      keys: []
      // Will be set per search type
    };
  }
  // ============================================
  // CUSTOMER SEARCH
  // ============================================
  searchCustomers(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllCustomers();
    }
    const {
      fuzzyFallback = true,
      limit = 50
    } = options;
    const ftsResults = this.searchCustomersFTS(query);
    if (ftsResults.length >= 3 || !fuzzyFallback) {
      return ftsResults.slice(0, limit);
    }
    const fuzzyResults = this.searchCustomersFuzzy(query, limit);
    const merged = this.mergeResults(ftsResults, fuzzyResults, "id");
    return merged.slice(0, limit);
  }
  searchCustomersFTS(query) {
    try {
      const ftsQuery = this.prepareFTSQuery(query);
      return db.searchCustomers(ftsQuery);
    } catch (error) {
      console.error("FTS5 search error:", error.message);
      return [];
    }
  }
  searchCustomersFuzzy(query, limit = 50) {
    const allCustomers = db.getAllCustomers();
    const fuse = new Fuse(allCustomers, {
      ...this.fuseOptions,
      keys: [
        { name: "name", weight: 2 },
        { name: "contact_name", weight: 1.5 },
        { name: "contact_email", weight: 1 },
        { name: "org_nr", weight: 1 },
        { name: "notes", weight: 0.5 }
      ]
    });
    const results = fuse.search(query);
    return results.map((r) => r.item).slice(0, limit);
  }
  // ============================================
  // INVOICE SEARCH
  // ============================================
  searchInvoices(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllInvoices();
    }
    const {
      fuzzyFallback = true,
      limit = 50,
      status = null
    } = options;
    let ftsResults = this.searchInvoicesFTS(query);
    if (status) {
      ftsResults = ftsResults.filter((inv) => inv.status === status);
    }
    if (ftsResults.length >= 3 || !fuzzyFallback) {
      return ftsResults.slice(0, limit);
    }
    const fuzzyResults = this.searchInvoicesFuzzy(query, limit, status);
    const merged = this.mergeResults(ftsResults, fuzzyResults, "id");
    return merged.slice(0, limit);
  }
  searchInvoicesFTS(query) {
    try {
      const ftsQuery = this.prepareFTSQuery(query);
      return db.searchInvoices(ftsQuery);
    } catch (error) {
      console.error("FTS5 search error:", error.message);
      return [];
    }
  }
  searchInvoicesFuzzy(query, limit = 50, status = null) {
    let allInvoices = db.getAllInvoices();
    if (status) {
      allInvoices = allInvoices.filter((inv) => inv.status === status);
    }
    const fuse = new Fuse(allInvoices, {
      ...this.fuseOptions,
      keys: [
        { name: "invoice_number", weight: 2 },
        { name: "customer_name", weight: 1.5 },
        { name: "notes", weight: 1 }
      ]
    });
    const results = fuse.search(query);
    return results.map((r) => r.item).slice(0, limit);
  }
  // ============================================
  // PROJECT SEARCH
  // ============================================
  searchProjects(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllProjects();
    }
    const {
      limit = 50,
      status = null
    } = options;
    let allProjects = db.getAllProjects();
    if (status) {
      allProjects = allProjects.filter((p) => p.status === status);
    }
    const fuse = new Fuse(allProjects, {
      ...this.fuseOptions,
      keys: [
        { name: "name", weight: 2 },
        { name: "customer_name", weight: 1.5 },
        { name: "description", weight: 1 },
        { name: "tags", weight: 0.8 },
        { name: "notes", weight: 0.5 }
      ]
    });
    const results = fuse.search(query);
    return results.map((r) => r.item).slice(0, limit);
  }
  // ============================================
  // EXPENSE SEARCH
  // ============================================
  searchExpenses(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllExpenses();
    }
    const {
      limit = 50,
      category = null
    } = options;
    let allExpenses = db.getAllExpenses();
    if (category) {
      allExpenses = allExpenses.filter((e) => e.category === category);
    }
    const fuse = new Fuse(allExpenses, {
      ...this.fuseOptions,
      keys: [
        { name: "description", weight: 2 },
        { name: "vendor", weight: 1.5 },
        { name: "category", weight: 1 },
        { name: "receipt_number", weight: 1 },
        { name: "notes", weight: 0.5 }
      ]
    });
    const results = fuse.search(query);
    return results.map((r) => r.item).slice(0, limit);
  }
  // ============================================
  // GLOBAL SEARCH (across all entities)
  // ============================================
  searchGlobal(query, options = {}) {
    const { limit = 20 } = options;
    const results = {
      customers: this.searchCustomers(query, { limit: limit / 4 }),
      invoices: this.searchInvoices(query, { limit: limit / 4 }),
      projects: this.searchProjects(query, { limit: limit / 4 }),
      expenses: this.searchExpenses(query, { limit: limit / 4 })
    };
    return results;
  }
  // ============================================
  // HELPER METHODS
  // ============================================
  prepareFTSQuery(query) {
    let escaped = query.replace(/"/g, '""').replace(/[*\-+()]/g, "");
    const words = escaped.trim().split(/\s+/);
    if (words.length === 1 && words[0].length < 3) {
      return `${words[0]}*`;
    }
    if (words.length > 1) {
      return `"${escaped}" OR ${words.join(" OR ")}`;
    }
    return escaped;
  }
  mergeResults(arr1, arr2, keyField) {
    const seen = /* @__PURE__ */ new Set();
    const merged = [];
    arr1.forEach((item) => {
      const key = item[keyField];
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });
    arr2.forEach((item) => {
      const key = item[keyField];
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });
    return merged;
  }
  // ============================================
  // ADVANCED FILTERS
  // ============================================
  filterCustomersByRevenue(minRevenue = 0, maxRevenue = Infinity) {
    const customersWithRevenue = db.getRevenueByCustomer(100);
    return customersWithRevenue.filter(
      (c) => c.total_revenue >= minRevenue && c.total_revenue <= maxRevenue
    );
  }
  filterInvoicesByDateRange(startDate, endDate) {
    const allInvoices = db.getAllInvoices();
    return allInvoices.filter((inv) => {
      const invoiceDate = new Date(inv.date);
      return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
    });
  }
  filterProjectsByBudget(minBudget = 0, maxBudget = Infinity) {
    const allProjects = db.getAllProjects();
    return allProjects.filter(
      (p) => p.budget >= minBudget && p.budget <= maxBudget
    );
  }
};
var search = new SearchEngine();

// src/store/index.js
var useCRMStore = create((set, get) => ({
  // ============================================
  // CUSTOMERS STATE
  // ============================================
  customers: [],
  selectedCustomer: null,
  customersLoading: false,
  loadCustomers: () => {
    set({ customersLoading: true });
    const customers = db.getAllCustomers();
    set({ customers, customersLoading: false });
  },
  selectCustomer: (customerId) => {
    const customer = db.getCustomer(customerId);
    set({ selectedCustomer: customer });
  },
  searchCustomers: (query) => {
    const results = search.searchCustomers(query);
    set({ customers: results });
  },
  clearCustomerSelection: () => {
    set({ selectedCustomer: null });
  },
  // ============================================
  // INVOICES STATE
  // ============================================
  invoices: [],
  selectedInvoice: null,
  invoicesLoading: false,
  loadInvoices: () => {
    set({ invoicesLoading: true });
    const invoices = db.getAllInvoices();
    set({ invoices, invoicesLoading: false });
  },
  loadInvoicesByCustomer: (customerId) => {
    set({ invoicesLoading: true });
    const invoices = db.getInvoicesByCustomer(customerId);
    set({ invoices, invoicesLoading: false });
  },
  selectInvoice: (invoiceId) => {
    const invoice = db.getInvoice(invoiceId);
    set({ selectedInvoice: invoice });
  },
  searchInvoices: (query, options) => {
    const results = search.searchInvoices(query, options);
    set({ invoices: results });
  },
  clearInvoiceSelection: () => {
    set({ selectedInvoice: null });
  },
  getOverdueInvoices: () => {
    const overdueInvoices = db.getOverdueInvoices();
    set({ invoices: overdueInvoices });
  },
  // ============================================
  // PROJECTS STATE
  // ============================================
  projects: [],
  selectedProject: null,
  projectsLoading: false,
  loadProjects: () => {
    set({ projectsLoading: true });
    const projects = db.getAllProjects();
    set({ projects, projectsLoading: false });
  },
  loadProjectsByCustomer: (customerId) => {
    set({ projectsLoading: true });
    const projects = db.getProjectsByCustomer(customerId);
    set({ projects, projectsLoading: false });
  },
  selectProject: (projectId) => {
    const project = db.getProject(projectId);
    set({ selectedProject: project });
  },
  searchProjects: (query, options) => {
    const results = search.searchProjects(query, options);
    set({ projects: results });
  },
  clearProjectSelection: () => {
    set({ selectedProject: null });
  },
  // ============================================
  // EXPENSES STATE
  // ============================================
  expenses: [],
  selectedExpense: null,
  expensesLoading: false,
  loadExpenses: () => {
    set({ expensesLoading: true });
    const expenses = db.getAllExpenses();
    set({ expenses, expensesLoading: false });
  },
  selectExpense: (expenseId) => {
    const expense = db.getExpense(expenseId);
    set({ selectedExpense: expense });
  },
  searchExpenses: (query, options) => {
    const results = search.searchExpenses(query, options);
    set({ expenses: results });
  },
  clearExpenseSelection: () => {
    set({ selectedExpense: null });
  },
  // ============================================
  // STATS STATE
  // ============================================
  stats: null,
  statsLoading: false,
  loadStats: () => {
    set({ statsLoading: true });
    const stats = db.getOverallStats();
    set({ stats, statsLoading: false });
  },
  // ============================================
  // UI STATE
  // ============================================
  currentView: "main-menu",
  // 'main-menu', 'customer-list', 'customer-detail', etc.
  previousView: null,
  searchQuery: "",
  isSearching: false,
  setView: (view) => {
    const previousView = get().currentView;
    set({ currentView: view, previousView });
  },
  goBack: () => {
    const previousView = get().previousView;
    if (previousView) {
      set({ currentView: previousView, previousView: null });
    } else {
      set({ currentView: "main-menu" });
    }
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query, isSearching: query.length > 0 });
  },
  clearSearch: () => {
    set({ searchQuery: "", isSearching: false });
  },
  // ============================================
  // GLOBAL ACTIONS
  // ============================================
  refreshAll: () => {
    get().loadCustomers();
    get().loadInvoices();
    get().loadProjects();
    get().loadExpenses();
    get().loadStats();
  },
  reset: () => {
    set({
      customers: [],
      invoices: [],
      projects: [],
      expenses: [],
      selectedCustomer: null,
      selectedInvoice: null,
      selectedProject: null,
      selectedExpense: null,
      stats: null,
      currentView: "main-menu",
      searchQuery: "",
      isSearching: false
    });
  }
}));
var useCustomers = () => useCRMStore((state) => ({
  customers: state.customers,
  selectedCustomer: state.selectedCustomer,
  loading: state.customersLoading,
  load: state.loadCustomers,
  select: state.selectCustomer,
  search: state.searchCustomers,
  clear: state.clearCustomerSelection
}));
var useInvoices = () => useCRMStore((state) => ({
  invoices: state.invoices,
  selectedInvoice: state.selectedInvoice,
  loading: state.invoicesLoading,
  load: state.loadInvoices,
  loadByCustomer: state.loadInvoicesByCustomer,
  select: state.selectInvoice,
  search: state.searchInvoices,
  clear: state.clearInvoiceSelection,
  getOverdue: state.getOverdueInvoices
}));
var useProjects = () => useCRMStore((state) => ({
  projects: state.projects,
  selectedProject: state.selectedProject,
  loading: state.projectsLoading,
  load: state.loadProjects,
  loadByCustomer: state.loadProjectsByCustomer,
  select: state.selectProject,
  search: state.searchProjects,
  clear: state.clearProjectSelection
}));
var useStats = () => useCRMStore((state) => ({
  stats: state.stats,
  loading: state.statsLoading,
  load: state.loadStats
}));

// src/ui/views/MainMenu.js
import React3, { useEffect } from "react";
import { Box as Box3, Text as Text3 } from "ink";
import SelectInput from "ink-select-input";

// src/ui/design-system/Card.js
import React from "react";
import { Box, Text } from "ink";
function Card({
  title,
  children,
  borderColor = "gray",
  padding = 1,
  marginTop = 0,
  marginBottom = 1,
  highlight = false
}) {
  const actualBorderColor = highlight ? "cyan" : borderColor;
  return /* @__PURE__ */ React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: actualBorderColor,
      paddingX: padding,
      paddingY: 0,
      marginTop,
      marginBottom
    },
    title && /* @__PURE__ */ React.createElement(Box, { marginBottom: 1 }, /* @__PURE__ */ React.createElement(Text, { bold: true, color: highlight ? "cyan" : "white" }, title)),
    children
  );
}
function CardRow({
  label,
  value,
  labelColor = "gray",
  valueColor = "white",
  dimLabel = true
}) {
  return /* @__PURE__ */ React.createElement(Box, { justifyContent: "space-between", marginBottom: 0 }, /* @__PURE__ */ React.createElement(Box, { marginRight: 2 }, /* @__PURE__ */ React.createElement(Text, { color: labelColor, dimColor: dimLabel }, label, ":")), /* @__PURE__ */ React.createElement(Text, { color: valueColor }, value));
}
function CardSection({ title, children, marginTop = 1 }) {
  return /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop }, title && /* @__PURE__ */ React.createElement(Box, { marginBottom: 0 }, /* @__PURE__ */ React.createElement(Text, { bold: true, dimColor: true }, title)), /* @__PURE__ */ React.createElement(Box, { flexDirection: "column" }, children));
}

// src/ui/design-system/HelpText.js
import React2 from "react";
import { Box as Box2, Text as Text2 } from "ink";
function HelpText({ children, marginTop = 1, marginBottom = 0 }) {
  return /* @__PURE__ */ React2.createElement(Box2, { marginTop, marginBottom }, /* @__PURE__ */ React2.createElement(Text2, { dimColor: true }, children));
}

// src/ui/views/MainMenu.js
function MainMenu() {
  const setView = useCRMStore((state) => state.setView);
  const { stats, load: loadStats } = useStats();
  useEffect(() => {
    loadStats();
  }, []);
  const menuItems = [
    {
      label: "KUNDER",
      value: "customers",
      description: stats ? `${stats.total_customers} kunder` : "Se alle kunder"
    },
    {
      label: "FAKTURAER",
      value: "invoices",
      description: stats ? `${stats.total_invoices} fakturaer (${stats.overdue_count} forfalt)` : "Se alle fakturaer"
    },
    {
      label: "PROSJEKTER",
      value: "projects",
      description: stats ? `${stats.total_projects} prosjekter` : "Se alle prosjekter"
    },
    {
      label: "\xD8KONOMI",
      value: "economy",
      description: "Rapporter og statistikk"
    },
    {
      label: "S\xD8\xD8K",
      value: "search",
      description: "S\xF8k i alle data"
    },
    {
      label: "AVSLUTT",
      value: "exit",
      description: "Avslutt CRM"
    }
  ];
  const handleSelect = (item) => {
    if (item.value === "exit") {
      process.exit(0);
    } else if (item.value === "customers") {
      setView("customer-list");
    } else if (item.value === "invoices") {
      setView("invoice-list");
    } else if (item.value === "projects") {
      setView("project-list");
    } else if (item.value === "economy") {
      setView("economy-menu");
    } else if (item.value === "search") {
      setView("global-search");
    }
  };
  const itemComponent = ({ label, isSelected }) => /* @__PURE__ */ React3.createElement(Box3, null, /* @__PURE__ */ React3.createElement(Text3, { color: isSelected ? "cyan" : "white", bold: isSelected }, isSelected ? "\u25B6 " : "  ", label));
  const indicatorComponent = () => null;
  return /* @__PURE__ */ React3.createElement(Box3, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React3.createElement(Box3, { marginBottom: 2 }, /* @__PURE__ */ React3.createElement(Text3, { bold: true, color: "cyan" }, "CRM TERMINAL")), stats && /* @__PURE__ */ React3.createElement(Card, { title: "Oversikt", marginBottom: 2 }, /* @__PURE__ */ React3.createElement(Box3, { flexDirection: "column" }, /* @__PURE__ */ React3.createElement(Box3, { justifyContent: "space-between" }, /* @__PURE__ */ React3.createElement(Text3, { dimColor: true }, "Kunder:"), /* @__PURE__ */ React3.createElement(Text3, null, stats.total_customers)), /* @__PURE__ */ React3.createElement(Box3, { justifyContent: "space-between" }, /* @__PURE__ */ React3.createElement(Text3, { dimColor: true }, "Fakturaer:"), /* @__PURE__ */ React3.createElement(Text3, null, stats.total_invoices)), /* @__PURE__ */ React3.createElement(Box3, { justifyContent: "space-between" }, /* @__PURE__ */ React3.createElement(Text3, { dimColor: true }, "Prosjekter:"), /* @__PURE__ */ React3.createElement(Text3, null, stats.total_projects)), stats.overdue_count > 0 && /* @__PURE__ */ React3.createElement(Box3, { justifyContent: "space-between", marginTop: 1 }, /* @__PURE__ */ React3.createElement(Text3, { color: "red" }, "Forfalte fakturaer:"), /* @__PURE__ */ React3.createElement(Text3, { color: "red", bold: true }, stats.overdue_count)), stats.outstanding_invoices > 0 && /* @__PURE__ */ React3.createElement(Box3, { justifyContent: "space-between" }, /* @__PURE__ */ React3.createElement(Text3, { dimColor: true }, "Utest\xE5ende:"), /* @__PURE__ */ React3.createElement(Text3, null, (stats.outstanding_invoices / 100).toLocaleString("nb-NO"), " kr")))), /* @__PURE__ */ React3.createElement(
    SelectInput,
    {
      items: menuItems,
      onSelect: handleSelect,
      itemComponent,
      indicatorComponent
    }
  ), /* @__PURE__ */ React3.createElement(HelpText, { marginTop: 2 }, "\u2191\u2193: Naviger \u2022 Enter: Velg \u2022 Ctrl+C: Avslutt"));
}
var MainMenu_default = MainMenu;

// src/ui/views/CustomerList.js
import React7, { useState as useState4, useEffect as useEffect4 } from "react";
import { Box as Box6, Text as Text6, useInput as useInput2 } from "ink";

// src/ui/hooks/useScroll.js
import { useState, useEffect as useEffect2 } from "react";
import { useInput } from "ink";
function useScroll(items = [], pageSize = 10, initialIndex = 0) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [startIndex, setStartIndex] = useState(0);
  const totalItems = items.length;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const visibleItems = items.slice(startIndex, endIndex);
  const canScrollUp = startIndex > 0;
  const canScrollDown = endIndex < totalItems;
  useEffect2(() => {
    if (selectedIndex < startIndex) {
      setStartIndex(selectedIndex);
    } else if (selectedIndex >= endIndex) {
      setStartIndex(Math.max(0, selectedIndex - pageSize + 1));
    }
  }, [selectedIndex, startIndex, endIndex, pageSize]);
  const scrollUp = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };
  const scrollDown = () => {
    if (selectedIndex < totalItems - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };
  const scrollPageUp = () => {
    const newIndex = Math.max(0, selectedIndex - pageSize);
    setSelectedIndex(newIndex);
    setStartIndex(Math.max(0, newIndex));
  };
  const scrollPageDown = () => {
    const newIndex = Math.min(totalItems - 1, selectedIndex + pageSize);
    setSelectedIndex(newIndex);
  };
  const scrollToTop = () => {
    setSelectedIndex(0);
    setStartIndex(0);
  };
  const scrollToBottom = () => {
    setSelectedIndex(totalItems - 1);
    setStartIndex(Math.max(0, totalItems - pageSize));
  };
  const select = (index) => {
    if (index >= 0 && index < totalItems) {
      setSelectedIndex(index);
    }
  };
  return {
    selectedIndex,
    startIndex,
    endIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    scrollUp,
    scrollDown,
    scrollPageUp,
    scrollPageDown,
    scrollToTop,
    scrollToBottom,
    select,
    totalItems
  };
}
function useScrollWithKeyboard(items = [], pageSize = 10, options = {}) {
  const {
    onSelect,
    onEscape,
    disabled = false,
    initialIndex = 0
  } = options;
  const scroll = useScroll(items, pageSize, initialIndex);
  useInput((input, key) => {
    if (disabled) return;
    if (key.upArrow || input === "k") {
      scroll.scrollUp();
    } else if (key.downArrow || input === "j") {
      scroll.scrollDown();
    } else if (key.pageUp) {
      scroll.scrollPageUp();
    } else if (key.pageDown) {
      scroll.scrollPageDown();
    } else if (input === "g") {
      scroll.scrollToTop();
    } else if (input === "G") {
      scroll.scrollToBottom();
    } else if (key.return && onSelect) {
      onSelect(items[scroll.selectedIndex], scroll.selectedIndex);
    } else if (key.escape && onEscape) {
      onEscape();
    }
  }, [scroll, items, onSelect, onEscape, disabled]);
  return scroll;
}

// src/ui/hooks/useWindowSize.js
import { useState as useState2, useEffect as useEffect3 } from "react";
function useWindowSize() {
  const [size, setSize] = useState2({
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  });
  useEffect3(() => {
    const handleResize = () => {
      setSize({
        width: process.stdout.columns || 80,
        height: process.stdout.rows || 24
      });
    };
    process.stdout.on("resize", handleResize);
    return () => {
      process.stdout.off("resize", handleResize);
    };
  }, []);
  const isMobile = size.width < 60;
  const isSmall = size.width >= 60 && size.width < 80;
  const isMedium = size.width >= 80 && size.width < 120;
  const isLarge = size.width >= 120;
  return {
    width: size.width,
    height: size.height,
    isMobile,
    isSmall,
    isMedium,
    isLarge
  };
}

// src/ui/components/SearchBar.js
import React4, { useState as useState3 } from "react";
import { Box as Box4, Text as Text4 } from "ink";
import TextInput from "ink-text-input";
function SearchBar({
  onSearch,
  placeholder = "Search...",
  initialValue = "",
  onChange,
  showResultCount = false,
  resultCount = 0
}) {
  const [query, setQuery] = useState3(initialValue);
  const handleChange = (value) => {
    setQuery(value);
    if (onChange) {
      onChange(value);
    }
    if (onSearch) {
      onSearch(value);
    }
  };
  return /* @__PURE__ */ React4.createElement(Box4, { flexDirection: "column", marginBottom: 1 }, /* @__PURE__ */ React4.createElement(Box4, null, /* @__PURE__ */ React4.createElement(Text4, { color: "cyan", bold: true }, "\u{1F50D}", " "), /* @__PURE__ */ React4.createElement(Box4, { flexGrow: 1 }, /* @__PURE__ */ React4.createElement(
    TextInput,
    {
      value: query,
      onChange: handleChange,
      placeholder
    }
  ))), showResultCount && /* @__PURE__ */ React4.createElement(Box4, { marginTop: 0 }, /* @__PURE__ */ React4.createElement(Text4, { dimColor: true }, resultCount === 0 && query.length > 0 && "No results found", resultCount > 0 && `${resultCount} result${resultCount === 1 ? "" : "s"}`, resultCount === 0 && query.length === 0 && "Type to search...")));
}
var SearchBar_default = SearchBar;

// src/ui/design-system/ScrollBox.js
import React5 from "react";
import { Box as Box5, Text as Text5 } from "ink";
function ScrollBox({
  children,
  height = 10,
  canScrollUp = false,
  canScrollDown = false,
  currentIndex = 0,
  totalItems = 0,
  showScrollbar = true,
  showHelp = true
}) {
  return /* @__PURE__ */ React5.createElement(Box5, { flexDirection: "column" }, showScrollbar && canScrollUp && /* @__PURE__ */ React5.createElement(Box5, { justifyContent: "center", marginBottom: 0 }, /* @__PURE__ */ React5.createElement(Text5, { color: "cyan", dimColor: true }, "\u25B2 More above")), /* @__PURE__ */ React5.createElement(Box5, { flexDirection: "column", minHeight: height }, children), showScrollbar && canScrollDown && /* @__PURE__ */ React5.createElement(Box5, { justifyContent: "center", marginTop: 0 }, /* @__PURE__ */ React5.createElement(Text5, { color: "cyan", dimColor: true }, "\u25BC More below")), (showScrollbar || showHelp) && totalItems > 0 && /* @__PURE__ */ React5.createElement(Box5, { marginTop: 1, justifyContent: "space-between" }, showScrollbar && /* @__PURE__ */ React5.createElement(Text5, { dimColor: true }, currentIndex + 1, "/", totalItems), showHelp && /* @__PURE__ */ React5.createElement(Text5, { dimColor: true }, "\u2191\u2193: Navigate \u2022 Enter: Select \u2022 Esc: Back")));
}

// src/ui/design-system/RenderIfWindowSize.js
import React6 from "react";
function RenderIfWindowSize({
  minWidth,
  maxWidth,
  mobile = false,
  small = false,
  medium = false,
  large = false,
  children,
  fallback = null
}) {
  const { width, isMobile, isSmall, isMedium, isLarge } = useWindowSize();
  let shouldRender = true;
  if (mobile || small || medium || large) {
    shouldRender = mobile && isMobile || small && isSmall || medium && isMedium || large && isLarge;
  }
  if (minWidth !== void 0 && width < minWidth) {
    shouldRender = false;
  }
  if (maxWidth !== void 0 && width > maxWidth) {
    shouldRender = false;
  }
  return shouldRender ? children : fallback;
}

// src/ui/views/CustomerList.js
function CustomerList() {
  const { customers, load, search: searchCustomers } = useCustomers();
  const setView = useCRMStore((state) => state.setView);
  const selectCustomer = useCRMStore((state) => state.selectCustomer);
  const goBack = useCRMStore((state) => state.goBack);
  const [searchQuery, setSearchQuery] = useState4("");
  const { height } = useWindowSize();
  const pageSize = Math.max(5, height - 15);
  useEffect4(() => {
    load();
  }, []);
  const {
    selectedIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    totalItems
  } = useScrollWithKeyboard(customers, pageSize, {
    onSelect: (customer) => {
      selectCustomer(customer.id);
      setView("customer-detail");
    },
    onEscape: () => {
      goBack();
    }
  });
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchCustomers(query);
    } else {
      load();
    }
  };
  return /* @__PURE__ */ React7.createElement(Box6, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React7.createElement(Box6, { marginBottom: 1 }, /* @__PURE__ */ React7.createElement(Text6, { bold: true, color: "cyan" }, "KUNDER"), /* @__PURE__ */ React7.createElement(Text6, { dimColor: true }, " (", customers.length, " kunder)")), /* @__PURE__ */ React7.createElement(
    SearchBar_default,
    {
      onSearch: handleSearch,
      placeholder: "S\xF8k kunder...",
      showResultCount: searchQuery.length > 0,
      resultCount: customers.length
    }
  ), customers.length === 0 ? /* @__PURE__ */ React7.createElement(Box6, { marginTop: 2 }, /* @__PURE__ */ React7.createElement(Text6, { dimColor: true }, searchQuery.length > 0 ? "Ingen kunder funnet" : "Laster kunder...")) : /* @__PURE__ */ React7.createElement(
    ScrollBox,
    {
      height: pageSize,
      canScrollUp,
      canScrollDown,
      currentIndex: selectedIndex,
      totalItems
    },
    visibleItems.map((customer, idx) => {
      const isSelected = idx + (selectedIndex - selectedIndex % pageSize) === selectedIndex;
      return /* @__PURE__ */ React7.createElement(
        CustomerListItem,
        {
          key: customer.id,
          customer,
          isSelected
        }
      );
    })
  ), /* @__PURE__ */ React7.createElement(HelpText, null, "\u2191\u2193: Naviger \u2022 Enter: Se detaljer \u2022 /: S\xF8k \u2022 Esc: Tilbake"));
}
function CustomerListItem({ customer, isSelected }) {
  const { width } = useWindowSize();
  const showFullDetails = width >= 100;
  const showMediumDetails = width >= 80 && width < 100;
  return /* @__PURE__ */ React7.createElement(Box6, { marginBottom: 0 }, /* @__PURE__ */ React7.createElement(Box6, { width: "100%" }, /* @__PURE__ */ React7.createElement(Box6, { width: 2 }, /* @__PURE__ */ React7.createElement(Text6, { color: isSelected ? "cyan" : "gray" }, isSelected ? "\u25B6" : " ")), /* @__PURE__ */ React7.createElement(Box6, { width: showFullDetails ? 30 : 25, flexShrink: 0 }, /* @__PURE__ */ React7.createElement(
    Text6,
    {
      color: isSelected ? "cyan" : "white",
      bold: isSelected,
      wrap: "truncate"
    },
    customer.name
  )), /* @__PURE__ */ React7.createElement(RenderIfWindowSize, { minWidth: 80 }, /* @__PURE__ */ React7.createElement(Box6, { width: showFullDetails ? 25 : 20, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React7.createElement(Text6, { dimColor: true, wrap: "truncate" }, customer.contact_name || customer.contact_email || "-"))), /* @__PURE__ */ React7.createElement(RenderIfWindowSize, { minWidth: 100 }, /* @__PURE__ */ React7.createElement(Box6, { width: 15, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React7.createElement(Text6, { dimColor: true, wrap: "truncate" }, customer.address_city || "-"))), /* @__PURE__ */ React7.createElement(RenderIfWindowSize, { minWidth: 120 }, /* @__PURE__ */ React7.createElement(Box6, { width: 12, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React7.createElement(Text6, { dimColor: true, wrap: "truncate" }, customer.org_nr || "-")))));
}
var CustomerList_default = CustomerList;

// src/ui/views/CustomerDetail.js
import React9, { useEffect as useEffect5 } from "react";
import { Box as Box8, Text as Text8 } from "ink";

// src/ui/design-system/Badge.js
import React8 from "react";
import { Box as Box7, Text as Text7 } from "ink";
function Badge({ children, color, variant = "default" }) {
  const variantColors = {
    default: "gray",
    success: "green",
    warning: "yellow",
    error: "red",
    info: "cyan",
    primary: "blue"
  };
  const badgeColor = color || variantColors[variant] || "gray";
  return /* @__PURE__ */ React8.createElement(Box7, null, /* @__PURE__ */ React8.createElement(Text7, { color: badgeColor, bold: true }, "[", children, "]"));
}
function StatusBadge({ status }) {
  const statusColors = {
    draft: "gray",
    sent: "yellow",
    paid: "green",
    "in-progress": "cyan",
    completed: "green",
    "on-hold": "yellow",
    overdue: "red",
    active: "green",
    inactive: "gray",
    pending: "yellow",
    approved: "green",
    rejected: "red"
  };
  const color = statusColors[status.toLowerCase()] || "gray";
  return /* @__PURE__ */ React8.createElement(Badge, { color }, status);
}

// src/ui/views/CustomerDetail.js
function CustomerDetail() {
  const { selectedCustomer } = useCustomers();
  const { invoices, loadByCustomer: loadInvoices } = useInvoices();
  const { projects, loadByCustomer: loadProjects } = useProjects();
  const goBack = useCRMStore((state) => state.goBack);
  useEffect5(() => {
    if (selectedCustomer) {
      loadInvoices(selectedCustomer.id);
      loadProjects(selectedCustomer.id);
    }
  }, [selectedCustomer]);
  if (!selectedCustomer) {
    return /* @__PURE__ */ React9.createElement(Box8, { padding: 1 }, /* @__PURE__ */ React9.createElement(Text8, null, "Ingen kunde valgt"));
  }
  const customer = selectedCustomer;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && new Date(inv.due_date) < /* @__PURE__ */ new Date()
  ).length;
  return /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React9.createElement(Box8, { marginBottom: 2 }, /* @__PURE__ */ React9.createElement(Text8, { bold: true, color: "cyan" }, customer.name)), /* @__PURE__ */ React9.createElement(
    RenderIfWindowSize,
    {
      minWidth: 100,
      fallback: /* @__PURE__ */ React9.createElement(SingleColumnLayout, { customer, invoices, projects })
    },
    /* @__PURE__ */ React9.createElement(Box8, null, /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column", width: "50%", marginRight: 2 }, /* @__PURE__ */ React9.createElement(CustomerInfoCard, { customer }), /* @__PURE__ */ React9.createElement(
      CustomerStatsCard,
      {
        totalInvoices,
        totalRevenue,
        paidInvoices,
        overdueInvoices
      }
    )), /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column", width: "50%" }, /* @__PURE__ */ React9.createElement(RecentInvoicesCard, { invoices }), /* @__PURE__ */ React9.createElement(ActiveProjectsCard, { projects })))
  ), /* @__PURE__ */ React9.createElement(HelpText, null, "Esc: Tilbake til kundeliste"));
}
function SingleColumnLayout({ customer, invoices, projects }) {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && new Date(inv.due_date) < /* @__PURE__ */ new Date()
  ).length;
  return /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column" }, /* @__PURE__ */ React9.createElement(CustomerInfoCard, { customer }), /* @__PURE__ */ React9.createElement(
    CustomerStatsCard,
    {
      totalInvoices,
      totalRevenue,
      paidInvoices,
      overdueInvoices
    }
  ), /* @__PURE__ */ React9.createElement(RecentInvoicesCard, { invoices }), /* @__PURE__ */ React9.createElement(ActiveProjectsCard, { projects }));
}
function CustomerInfoCard({ customer }) {
  return /* @__PURE__ */ React9.createElement(Card, { title: "Kontaktinformasjon" }, customer.contact_name && /* @__PURE__ */ React9.createElement(CardRow, { label: "Kontakt", value: customer.contact_name }), customer.contact_email && /* @__PURE__ */ React9.createElement(CardRow, { label: "E-post", value: customer.contact_email }), customer.contact_phone && /* @__PURE__ */ React9.createElement(CardRow, { label: "Telefon", value: customer.contact_phone }), customer.org_nr && /* @__PURE__ */ React9.createElement(CardRow, { label: "Org.nr", value: customer.org_nr }), (customer.address_street || customer.address_city) && /* @__PURE__ */ React9.createElement(CardSection, { title: "Adresse", marginTop: 1 }, customer.address_street && /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, customer.address_street), customer.address_city && /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, customer.address_postal_code, " ", customer.address_city)), customer.notes && /* @__PURE__ */ React9.createElement(CardSection, { title: "Notater", marginTop: 1 }, /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, customer.notes)));
}
function CustomerStatsCard({ totalInvoices, totalRevenue, paidInvoices, overdueInvoices }) {
  return /* @__PURE__ */ React9.createElement(Card, { title: "Statistikk" }, /* @__PURE__ */ React9.createElement(CardRow, { label: "Fakturaer", value: totalInvoices.toString() }), /* @__PURE__ */ React9.createElement(
    CardRow,
    {
      label: "Omsetning",
      value: `${(totalRevenue / 100).toLocaleString("nb-NO")} kr`,
      valueColor: "green"
    }
  ), /* @__PURE__ */ React9.createElement(CardRow, { label: "Betalte", value: paidInvoices.toString() }), overdueInvoices > 0 && /* @__PURE__ */ React9.createElement(CardRow, { label: "Forfalte", value: overdueInvoices.toString(), valueColor: "red" }));
}
function RecentInvoicesCard({ invoices }) {
  const recentInvoices = invoices.slice(0, 5);
  return /* @__PURE__ */ React9.createElement(Card, { title: "Siste fakturaer" }, recentInvoices.length === 0 ? /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, "Ingen fakturaer") : /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column" }, recentInvoices.map((invoice) => /* @__PURE__ */ React9.createElement(Box8, { key: invoice.id, justifyContent: "space-between", marginBottom: 0 }, /* @__PURE__ */ React9.createElement(Box8, { marginRight: 2 }, /* @__PURE__ */ React9.createElement(Text8, null, "#", invoice.invoice_number)), /* @__PURE__ */ React9.createElement(Box8, { marginRight: 2 }, /* @__PURE__ */ React9.createElement(StatusBadge, { status: invoice.status })), /* @__PURE__ */ React9.createElement(Text8, null, (invoice.total / 100).toLocaleString("nb-NO"), " kr")))));
}
function ActiveProjectsCard({ projects }) {
  const activeProjects = projects.filter((p) => p.status === "in-progress");
  return /* @__PURE__ */ React9.createElement(Card, { title: "Aktive prosjekter" }, activeProjects.length === 0 ? /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, "Ingen aktive prosjekter") : /* @__PURE__ */ React9.createElement(Box8, { flexDirection: "column" }, activeProjects.map((project) => /* @__PURE__ */ React9.createElement(Box8, { key: project.id, flexDirection: "column", marginBottom: 1 }, /* @__PURE__ */ React9.createElement(Text8, { bold: true }, project.name), /* @__PURE__ */ React9.createElement(Box8, { justifyContent: "space-between" }, /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, project.spent_hours || 0, "h / ", project.estimated_hours || "?", "h"), project.budget && /* @__PURE__ */ React9.createElement(Text8, { dimColor: true }, (project.budget / 100).toLocaleString("nb-NO"), " kr"))))));
}
var CustomerDetail_default = CustomerDetail;

// src/ui/views/InvoiceList.js
import React10, { useState as useState5, useEffect as useEffect6 } from "react";
import { Box as Box9, Text as Text9 } from "ink";
function InvoiceList() {
  const { invoices, load, search: searchInvoices, getOverdue } = useInvoices();
  const goBack = useCRMStore((state) => state.goBack);
  const [searchQuery, setSearchQuery] = useState5("");
  const [filterStatus, setFilterStatus] = useState5(null);
  const { height } = useWindowSize();
  const pageSize = Math.max(5, height - 15);
  useEffect6(() => {
    load();
  }, []);
  const {
    selectedIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    totalItems
  } = useScrollWithKeyboard(invoices, pageSize, {
    onSelect: (invoice) => {
      console.log("Selected invoice:", invoice);
    },
    onEscape: () => {
      goBack();
    }
  });
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchInvoices(query, { status: filterStatus });
    } else {
      if (filterStatus === "overdue") {
        getOverdue();
      } else {
        load();
      }
    }
  };
  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const overdueCount = invoices.filter(
    (inv) => inv.status !== "paid" && new Date(inv.due_date) < /* @__PURE__ */ new Date()
  ).length;
  return /* @__PURE__ */ React10.createElement(Box9, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React10.createElement(Box9, { marginBottom: 1 }, /* @__PURE__ */ React10.createElement(Text9, { bold: true, color: "cyan" }, "FAKTURAER"), /* @__PURE__ */ React10.createElement(Text9, { dimColor: true }, " (", invoices.length, " fakturaer)")), /* @__PURE__ */ React10.createElement(Box9, { marginBottom: 1, justifyContent: "space-between" }, /* @__PURE__ */ React10.createElement(Box9, null, /* @__PURE__ */ React10.createElement(Text9, { dimColor: true }, "Totalt: "), /* @__PURE__ */ React10.createElement(Text9, { bold: true }, (totalAmount / 100).toLocaleString("nb-NO"), " kr")), overdueCount > 0 && /* @__PURE__ */ React10.createElement(Box9, null, /* @__PURE__ */ React10.createElement(Text9, { color: "red" }, "Forfalte: "), /* @__PURE__ */ React10.createElement(Text9, { color: "red", bold: true }, overdueCount))), /* @__PURE__ */ React10.createElement(
    SearchBar_default,
    {
      onSearch: handleSearch,
      placeholder: "S\xF8k fakturaer...",
      showResultCount: searchQuery.length > 0,
      resultCount: invoices.length
    }
  ), invoices.length === 0 ? /* @__PURE__ */ React10.createElement(Box9, { marginTop: 2 }, /* @__PURE__ */ React10.createElement(Text9, { dimColor: true }, searchQuery.length > 0 ? "Ingen fakturaer funnet" : "Laster fakturaer...")) : /* @__PURE__ */ React10.createElement(
    ScrollBox,
    {
      height: pageSize,
      canScrollUp,
      canScrollDown,
      currentIndex: selectedIndex,
      totalItems
    },
    visibleItems.map((invoice, idx) => {
      const isSelected = idx + (selectedIndex - selectedIndex % pageSize) === selectedIndex;
      return /* @__PURE__ */ React10.createElement(InvoiceListItem, { key: invoice.id, invoice, isSelected });
    })
  ), /* @__PURE__ */ React10.createElement(HelpText, null, "\u2191\u2193: Naviger \u2022 Enter: Se detaljer \u2022 /: S\xF8k \u2022 Esc: Tilbake"));
}
function InvoiceListItem({ invoice, isSelected }) {
  const { width } = useWindowSize();
  const showFullDetails = width >= 100;
  const showMediumDetails = width >= 80 && width < 100;
  const isOverdue = invoice.status !== "paid" && new Date(invoice.due_date) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ React10.createElement(Box9, { marginBottom: 0 }, /* @__PURE__ */ React10.createElement(Box9, { width: "100%" }, /* @__PURE__ */ React10.createElement(Box9, { width: 2 }, /* @__PURE__ */ React10.createElement(Text9, { color: isSelected ? "cyan" : "gray" }, isSelected ? "\u25B6" : " ")), /* @__PURE__ */ React10.createElement(Box9, { width: 12, flexShrink: 0 }, /* @__PURE__ */ React10.createElement(
    Text9,
    {
      color: isSelected ? "cyan" : isOverdue ? "red" : "white",
      bold: isSelected || isOverdue,
      wrap: "truncate"
    },
    "#",
    invoice.invoice_number
  )), /* @__PURE__ */ React10.createElement(Box9, { width: showFullDetails ? 25 : 20, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React10.createElement(
    Text9,
    {
      color: isSelected ? "cyan" : "white",
      wrap: "truncate"
    },
    invoice.customer_name
  )), /* @__PURE__ */ React10.createElement(Box9, { width: 10, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React10.createElement(StatusBadge, { status: invoice.status })), /* @__PURE__ */ React10.createElement(RenderIfWindowSize, { minWidth: 80 }, /* @__PURE__ */ React10.createElement(Box9, { width: 12, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React10.createElement(Text9, { dimColor: true, wrap: "truncate" }, invoice.date))), /* @__PURE__ */ React10.createElement(RenderIfWindowSize, { minWidth: 100 }, /* @__PURE__ */ React10.createElement(Box9, { width: 12, flexShrink: 0, marginLeft: 2 }, /* @__PURE__ */ React10.createElement(Text9, { dimColor: !isOverdue, color: isOverdue ? "red" : void 0, wrap: "truncate" }, invoice.due_date))), /* @__PURE__ */ React10.createElement(Box9, { marginLeft: 2, justifyContent: "flex-end", flexGrow: 1 }, /* @__PURE__ */ React10.createElement(
    Text9,
    {
      color: isSelected ? "cyan" : "white",
      bold: isSelected
    },
    (invoice.total / 100).toLocaleString("nb-NO"),
    " kr"
  ))));
}
var InvoiceList_default = InvoiceList;

// src/ui/views/EconomyMenu.js
import React11, { useEffect as useEffect7 } from "react";
import { Box as Box10, Text as Text10 } from "ink";
import SelectInput2 from "ink-select-input";
function EconomyMenu() {
  const { stats, load: loadStats } = useStats();
  const goBack = useCRMStore((state) => state.goBack);
  useEffect7(() => {
    loadStats();
  }, []);
  const menuItems = [
    {
      label: "INNTEKTER",
      value: "revenue",
      description: "Inntektsrapport"
    },
    {
      label: "FORFALTE",
      value: "overdue",
      description: "Forfalte fakturaer"
    },
    {
      label: "TILBAKE",
      value: "back",
      description: "Tilbake til hovedmeny"
    }
  ];
  const handleSelect = (item) => {
    if (item.value === "back") {
      goBack();
    } else if (item.value === "overdue") {
      console.log("Show overdue invoices");
    } else if (item.value === "revenue") {
      console.log("Show revenue report");
    }
  };
  const itemComponent = ({ label, isSelected }) => /* @__PURE__ */ React11.createElement(Box10, null, /* @__PURE__ */ React11.createElement(Text10, { color: isSelected ? "cyan" : "white", bold: isSelected }, isSelected ? "\u25B6 " : "  ", label));
  const indicatorComponent = () => null;
  return /* @__PURE__ */ React11.createElement(Box10, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React11.createElement(Box10, { marginBottom: 2 }, /* @__PURE__ */ React11.createElement(Text10, { bold: true, color: "cyan" }, "\xD8KONOMI")), stats && /* @__PURE__ */ React11.createElement(Box10, { flexDirection: "column", marginBottom: 2 }, /* @__PURE__ */ React11.createElement(Card, { title: "Oversikt", marginBottom: 1 }, /* @__PURE__ */ React11.createElement(
    CardRow,
    {
      label: "Totalt fakturert",
      value: stats.total_revenue ? `${(stats.total_revenue / 100).toLocaleString("nb-NO")} kr` : "-",
      valueColor: "green"
    }
  ), /* @__PURE__ */ React11.createElement(
    CardRow,
    {
      label: "Utest\xE5ende",
      value: stats.outstanding_invoices ? `${(stats.outstanding_invoices / 100).toLocaleString("nb-NO")} kr` : "-",
      valueColor: "yellow"
    }
  ), /* @__PURE__ */ React11.createElement(
    CardRow,
    {
      label: "Forfalte fakturaer",
      value: stats.overdue_count ? stats.overdue_count.toString() : "0",
      valueColor: stats.overdue_count > 0 ? "red" : "green"
    }
  )), /* @__PURE__ */ React11.createElement(Card, { title: "Aktivitet" }, /* @__PURE__ */ React11.createElement(CardRow, { label: "Antall kunder", value: stats.total_customers.toString() }), /* @__PURE__ */ React11.createElement(CardRow, { label: "Antall fakturaer", value: stats.total_invoices.toString() }), /* @__PURE__ */ React11.createElement(CardRow, { label: "Antall prosjekter", value: stats.total_projects.toString() }))), /* @__PURE__ */ React11.createElement(
    SelectInput2,
    {
      items: menuItems,
      onSelect: handleSelect,
      itemComponent,
      indicatorComponent
    }
  ), /* @__PURE__ */ React11.createElement(HelpText, null, "\u2191\u2193: Naviger \u2022 Enter: Velg \u2022 Esc: Tilbake"));
}
var EconomyMenu_default = EconomyMenu;

// src/App.js
function App() {
  const currentView = useCRMStore((state) => state.currentView);
  const refreshAll = useCRMStore((state) => state.refreshAll);
  const { exit } = useApp();
  useEffect8(() => {
    refreshAll();
  }, []);
  useEffect8(() => {
    const handleExit = () => {
      exit();
    };
    process.on("SIGINT", handleExit);
    return () => {
      process.off("SIGINT", handleExit);
    };
  }, [exit]);
  const renderView = () => {
    switch (currentView) {
      case "main-menu":
        return /* @__PURE__ */ React12.createElement(MainMenu_default, null);
      case "customer-list":
        return /* @__PURE__ */ React12.createElement(CustomerList_default, null);
      case "customer-detail":
        return /* @__PURE__ */ React12.createElement(CustomerDetail_default, null);
      case "invoice-list":
        return /* @__PURE__ */ React12.createElement(InvoiceList_default, null);
      case "economy-menu":
        return /* @__PURE__ */ React12.createElement(EconomyMenu_default, null);
      case "project-list":
        return /* @__PURE__ */ React12.createElement(ProjectListPlaceholder, null);
      case "global-search":
        return /* @__PURE__ */ React12.createElement(GlobalSearchPlaceholder, null);
      default:
        return /* @__PURE__ */ React12.createElement(Box11, { padding: 1 }, /* @__PURE__ */ React12.createElement(Text11, { color: "red" }, "Unknown view: ", currentView));
    }
  };
  return /* @__PURE__ */ React12.createElement(Box11, { flexDirection: "column" }, renderView());
}
function ProjectListPlaceholder() {
  const goBack = useCRMStore((state) => state.goBack);
  return /* @__PURE__ */ React12.createElement(Box11, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React12.createElement(Box11, { marginBottom: 2 }, /* @__PURE__ */ React12.createElement(Text11, { bold: true, color: "cyan" }, "PROSJEKTER")), /* @__PURE__ */ React12.createElement(Text11, { dimColor: true }, "Prosjektoversikt kommer snart..."), /* @__PURE__ */ React12.createElement(Box11, { marginTop: 2 }, /* @__PURE__ */ React12.createElement(Text11, { dimColor: true }, "Trykk Esc for \xE5 g\xE5 tilbake")));
}
function GlobalSearchPlaceholder() {
  const goBack = useCRMStore((state) => state.goBack);
  return /* @__PURE__ */ React12.createElement(Box11, { flexDirection: "column", padding: 1 }, /* @__PURE__ */ React12.createElement(Box11, { marginBottom: 2 }, /* @__PURE__ */ React12.createElement(Text11, { bold: true, color: "cyan" }, "GLOBAL S\xD8K")), /* @__PURE__ */ React12.createElement(Text11, { dimColor: true }, "Global s\xF8k kommer snart..."), /* @__PURE__ */ React12.createElement(Box11, { marginTop: 2 }, /* @__PURE__ */ React12.createElement(Text11, { dimColor: true }, "Trykk Esc for \xE5 g\xE5 tilbake")));
}
var App_default = App;

// src/dashboard-ink.js
var { waitUntilExit } = render(/* @__PURE__ */ React13.createElement(App_default, null));
waitUntilExit().then(() => {
  console.log("\u{1F44B} Takk for n\xE5!");
  process.exit(0);
});
