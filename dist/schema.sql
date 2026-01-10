-- CRM Terminal Database Schema
-- SQLite with FTS5 (Full-Text Search)

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  org_nr TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address_street TEXT,
  address_postal_code TEXT,
  address_city TEXT,
  fiken_id INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search for customers
CREATE VIRTUAL TABLE IF NOT EXISTS customers_fts USING fts5(
  id UNINDEXED,
  name,
  contact_name,
  contact_email,
  notes,
  content=customers,
  content_rowid=rowid
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS customers_ai AFTER INSERT ON customers BEGIN
  INSERT INTO customers_fts(rowid, id, name, contact_name, contact_email, notes)
  VALUES (new.rowid, new.id, new.name, new.contact_name, new.contact_email, new.notes);
END;

CREATE TRIGGER IF NOT EXISTS customers_au AFTER UPDATE ON customers BEGIN
  UPDATE customers_fts
  SET name = new.name,
      contact_name = new.contact_name,
      contact_email = new.contact_email,
      notes = new.notes
  WHERE rowid = new.rowid;
END;

CREATE TRIGGER IF NOT EXISTS customers_ad AFTER DELETE ON customers BEGIN
  DELETE FROM customers_fts WHERE rowid = old.rowid;
END;

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  invoice_number TEXT UNIQUE,
  date TEXT,
  due_date TEXT,
  status TEXT CHECK(status IN ('draft', 'sent', 'paid')),
  subtotal INTEGER,
  vat INTEGER,
  total INTEGER,
  fiken_id INTEGER,
  fiken_synced BOOLEAN DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Full-text search for invoices
CREATE VIRTUAL TABLE IF NOT EXISTS invoices_fts USING fts5(
  id UNINDEXED,
  invoice_number,
  notes,
  content=invoices,
  content_rowid=rowid
);

-- Triggers for invoices FTS
CREATE TRIGGER IF NOT EXISTS invoices_ai AFTER INSERT ON invoices BEGIN
  INSERT INTO invoices_fts(rowid, id, invoice_number, notes)
  VALUES (new.rowid, new.id, new.invoice_number, new.notes);
END;

CREATE TRIGGER IF NOT EXISTS invoices_au AFTER UPDATE ON invoices BEGIN
  UPDATE invoices_fts
  SET invoice_number = new.invoice_number,
      notes = new.notes
  WHERE rowid = new.rowid;
END;

CREATE TRIGGER IF NOT EXISTS invoices_ad AFTER DELETE ON invoices BEGIN
  DELETE FROM invoices_fts WHERE rowid = old.rowid;
END;

-- ============================================
-- INVOICE ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id TEXT NOT NULL,
  description TEXT,
  hours REAL,
  rate INTEGER,
  amount INTEGER,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('in-progress', 'completed', 'on-hold')),
  start_date TEXT,
  deadline TEXT,
  estimated_hours REAL,
  spent_hours REAL DEFAULT 0,
  hourly_rate INTEGER,
  budget INTEGER,
  team TEXT, -- JSON array as text
  tags TEXT, -- JSON array as text
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT,
  category TEXT,
  amount INTEGER NOT NULL,
  receipt_file TEXT,
  receipt_number TEXT,
  vendor TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
