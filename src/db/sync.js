import fs from 'fs';
import path from 'path';
import { db } from './database.js';

class DBSync {
  constructor() {
    this.dataDir = path.resolve('./data');
    this.dataDirs = {
      customers: path.join(this.dataDir, 'customers'),
      invoices: path.join(this.dataDir, 'invoices'),
      projects: path.join(this.dataDir, 'projects'),
      expenses: path.join(this.dataDir, 'expenses')
    };
    // Legacy support for single JSON files
    this.jsonFiles = {
      customers: path.join(this.dataDir, 'customers.json'),
      invoices: path.join(this.dataDir, 'invoices.json'),
      projects: path.join(this.dataDir, 'projects.json'),
      expenses: path.join(this.dataDir, 'expenses.json')
    };
  }

  // ============================================
  // DATA MAPPING HELPERS
  // ============================================

  mapCustomerToDb(customer) {
    return {
      id: customer.id,
      name: customer.name,
      org_nr: customer.orgNr || customer.org_nr || null,
      contact_name: customer.contact?.name || customer.contact_name || null,
      contact_email: customer.contact?.email || customer.contact_email || null,
      contact_phone: customer.contact?.phone || customer.contact_phone || null,
      address_street: customer.address?.street || customer.address_street || null,
      address_postal_code: customer.address?.postalCode || customer.address_postal_code || null,
      address_city: customer.address?.city || customer.address_city || null,
      fiken_id: customer.fikenId || customer.fiken_id || null,
      notes: customer.notes || null
    };
  }

  mapInvoiceToDb(invoice) {
    return {
      id: String(invoice.id), // Ensure ID is always a string
      customer_id: invoice.customerId || invoice.customer_id,
      invoice_number: invoice.invoiceNumber || invoice.invoice_number ? String(invoice.invoiceNumber || invoice.invoice_number) : null,
      date: invoice.date || null,
      due_date: invoice.dueDate || invoice.due_date || null,
      status: invoice.status || 'draft',
      subtotal: invoice.subtotal || 0,
      vat: invoice.vat || 0,
      total: invoice.total || 0,
      fiken_id: invoice.fikenId || invoice.fiken_id || null,
      fiken_synced: (invoice.fikenSynced || invoice.fiken_synced) ? 1 : 0,
      notes: invoice.notes || null,
      items: invoice.items || []
    };
  }

  mapProjectToDb(project) {
    return {
      id: String(project.id),
      customer_id: project.customerId || project.customer_id,
      name: project.name,
      description: project.description || null,
      status: project.status || 'in-progress',
      start_date: project.startDate || project.start_date || null,
      deadline: project.deadline || null,
      estimated_hours: project.estimatedHours || project.estimated_hours || null,
      spent_hours: project.spentHours || project.spent_hours || 0,
      hourly_rate: project.hourlyRate || project.hourly_rate || null,
      budget: project.budget || null,
      team: project.team ? JSON.stringify(project.team) : null,
      tags: project.tags ? JSON.stringify(project.tags) : null,
      notes: project.notes || null
    };
  }

  mapExpenseToDb(expense) {
    return {
      id: String(expense.id),
      date: expense.date,
      description: expense.description || null,
      category: expense.category || null,
      amount: expense.amount,
      receipt_file: expense.receiptFile || expense.receipt_file || null,
      receipt_number: expense.receiptNumber || expense.receipt_number || null,
      vendor: expense.vendor || null,
      notes: expense.notes || null
    };
  }

  // ============================================
  // READ DATA FROM FILE STRUCTURE
  // ============================================

  readCustomers() {
    const customers = [];
    const customersDir = this.dataDirs.customers;

    if (fs.existsSync(customersDir)) {
      const files = fs.readdirSync(customersDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        try {
          const filePath = path.join(customersDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          customers.push(this.mapCustomerToDb(data));
        } catch (error) {
          console.error(`Error reading ${file}:`, error.message);
        }
      });
    }

    return customers;
  }

  readInvoices() {
    const invoices = [];
    const invoicesDir = this.dataDirs.invoices;

    if (fs.existsSync(invoicesDir)) {
      const files = fs.readdirSync(invoicesDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        try {
          const filePath = path.join(invoicesDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          invoices.push(this.mapInvoiceToDb(data));
        } catch (error) {
          console.error(`Error reading ${file}:`, error.message);
        }
      });
    }

    return invoices;
  }

  readProjects() {
    const projects = [];
    const projectsDir = this.dataDirs.projects;

    if (fs.existsSync(projectsDir)) {
      const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        try {
          const filePath = path.join(projectsDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          projects.push(this.mapProjectToDb(data));
        } catch (error) {
          console.error(`Error reading ${file}:`, error.message);
        }
      });
    }

    return projects;
  }

  readExpenses() {
    const expenses = [];
    const expensesDir = this.dataDirs.expenses;

    if (fs.existsSync(expensesDir)) {
      const files = fs.readdirSync(expensesDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        try {
          const filePath = path.join(expensesDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          expenses.push(this.mapExpenseToDb(data));
        } catch (error) {
          console.error(`Error reading ${file}:`, error.message);
        }
      });
    }

    return expenses;
  }

  // ============================================
  // IMPORT FROM JSON TO SQLITE
  // ============================================

  async importFromJSON() {
    console.log('🔄 Starting JSON → SQLite import...');

    try {
      // Import customers from directory structure
      const customers = this.readCustomers();
      if (customers.length > 0) {
        db.insertCustomersBatch(customers);
        console.log(`✓ Imported ${customers.length} customers`);
      }

      // Import invoices from directory structure
      const invoices = this.readInvoices();
      if (invoices.length > 0) {
        db.insertInvoicesBatch(invoices);
        console.log(`✓ Imported ${invoices.length} invoices`);
      }

      // Import projects from directory structure
      const projects = this.readProjects();
      if (projects.length > 0) {
        db.insertProjectsBatch(projects);
        console.log(`✓ Imported ${projects.length} projects`);
      }

      // Import expenses from directory structure
      const expenses = this.readExpenses();
      if (expenses.length > 0) {
        db.insertExpensesBatch(expenses);
        console.log(`✓ Imported ${expenses.length} expenses`);
      }

      console.log('✅ Import complete!');
      return true;
    } catch (error) {
      console.error('❌ Import failed:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  // ============================================
  // EXPORT FROM SQLITE TO JSON
  // ============================================

  async exportToJSON() {
    console.log('🔄 Starting SQLite → JSON export...');

    try {
      // Ensure data directory exists
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      // Export customers
      const customers = db.getAllCustomers();
      fs.writeFileSync(
        this.jsonFiles.customers,
        JSON.stringify(customers, null, 2),
        'utf-8'
      );
      console.log(`✓ Exported ${customers.length} customers`);

      // Export invoices (with items)
      const invoices = db.getAllInvoices();
      const invoicesWithItems = invoices.map(invoice => ({
        ...invoice,
        items: db.getInvoiceItems(invoice.id)
      }));
      fs.writeFileSync(
        this.jsonFiles.invoices,
        JSON.stringify(invoicesWithItems, null, 2),
        'utf-8'
      );
      console.log(`✓ Exported ${invoices.length} invoices`);

      // Export projects
      const projects = db.getAllProjects();
      fs.writeFileSync(
        this.jsonFiles.projects,
        JSON.stringify(projects, null, 2),
        'utf-8'
      );
      console.log(`✓ Exported ${projects.length} projects`);

      // Export expenses
      const expenses = db.getAllExpenses();
      fs.writeFileSync(
        this.jsonFiles.expenses,
        JSON.stringify(expenses, null, 2),
        'utf-8'
      );
      console.log(`✓ Exported ${expenses.length} expenses`);

      console.log('✅ Export complete!');
      return true;
    } catch (error) {
      console.error('❌ Export failed:', error.message);
      throw error;
    }
  }

  // ============================================
  // BIDIRECTIONAL SYNC
  // ============================================

  async sync(direction = 'both') {
    try {
      if (direction === 'import' || direction === 'both') {
        await this.importFromJSON();
      }

      if (direction === 'export' || direction === 'both') {
        await this.exportToJSON();
      }

      return true;
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      throw error;
    }
  }

  // ============================================
  // FILE WATCHING & AUTO-SYNC
  // ============================================

  watchJSONFiles(callback) {
    console.log('👁️  Watching JSON files for changes...');

    const watchers = [];

    Object.entries(this.jsonFiles).forEach(([name, filePath]) => {
      if (fs.existsSync(filePath)) {
        const watcher = fs.watch(filePath, async (eventType) => {
          if (eventType === 'change') {
            console.log(`📝 ${name}.json changed, syncing...`);
            try {
              await this.importFromJSON();
              if (callback) callback(name);
            } catch (error) {
              console.error(`Error syncing ${name}:`, error.message);
            }
          }
        });
        watchers.push(watcher);
      }
    });

    return () => {
      watchers.forEach(watcher => watcher.close());
      console.log('✓ Stopped watching files');
    };
  }

  // ============================================
  // CONFLICT RESOLUTION
  // ============================================

  async resolveConflicts() {
    // Simple last-write-wins strategy
    // In a more sophisticated version, you could:
    // - Compare timestamps
    // - Merge changes intelligently
    // - Prompt user for conflict resolution

    console.log('🔍 Checking for conflicts...');

    const dbTimestamp = this.getDBLastModified();
    const jsonTimestamp = this.getJSONLastModified();

    if (jsonTimestamp > dbTimestamp) {
      console.log('📄 JSON is newer, importing...');
      await this.importFromJSON();
    } else if (dbTimestamp > jsonTimestamp) {
      console.log('💾 Database is newer, exporting...');
      await this.exportToJSON();
    } else {
      console.log('✓ No conflicts detected');
    }
  }

  getDBLastModified() {
    const dbPath = path.resolve('./data/crm.db');
    if (fs.existsSync(dbPath)) {
      return fs.statSync(dbPath).mtime.getTime();
    }
    return 0;
  }

  getJSONLastModified() {
    let latestTime = 0;

    Object.values(this.jsonFiles).forEach(filePath => {
      if (fs.existsSync(filePath)) {
        const mtime = fs.statSync(filePath).mtime.getTime();
        if (mtime > latestTime) {
          latestTime = mtime;
        }
      }
    });

    return latestTime;
  }

  // ============================================
  // BACKUP & RESTORE
  // ============================================

  async createBackup(backupName) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupDir = path.join(this.dataDir, 'backups', backupName || timestamp);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Backup JSON files
    Object.entries(this.jsonFiles).forEach(([name, filePath]) => {
      if (fs.existsSync(filePath)) {
        const backupPath = path.join(backupDir, `${name}.json`);
        fs.copyFileSync(filePath, backupPath);
      }
    });

    // Backup SQLite database
    const dbPath = path.resolve('./data/crm.db');
    if (fs.existsSync(dbPath)) {
      const backupDbPath = path.join(backupDir, 'crm.db');
      db.backup(backupDbPath);
    }

    console.log(`✅ Backup created: ${backupDir}`);
    return backupDir;
  }

  async restoreFromBackup(backupPath) {
    console.log(`🔄 Restoring from backup: ${backupPath}`);

    // Restore JSON files
    Object.entries(this.jsonFiles).forEach(([name, filePath]) => {
      const backupFile = path.join(backupPath, `${name}.json`);
      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, filePath);
        console.log(`✓ Restored ${name}.json`);
      }
    });

    // Restore database
    const backupDbPath = path.join(backupPath, 'crm.db');
    if (fs.existsSync(backupDbPath)) {
      const dbPath = path.resolve('./data/crm.db');
      // Close current connection
      db.close();
      // Copy backup
      fs.copyFileSync(backupDbPath, dbPath);
      // Reconnect
      db.connect();
      console.log('✓ Restored database');
    }

    console.log('✅ Restore complete!');
  }

  // ============================================
  // VALIDATION & INTEGRITY CHECKS
  // ============================================

  async validateSync() {
    console.log('🔍 Validating sync integrity...');

    const issues = [];

    // Check if all customers in invoices exist
    const invoices = db.getAllInvoices();
    const customers = db.getAllCustomers();
    const customerIds = new Set(customers.map(c => c.id));

    invoices.forEach(invoice => {
      if (!customerIds.has(invoice.customer_id)) {
        issues.push({
          type: 'missing_customer',
          invoice_id: invoice.id,
          customer_id: invoice.customer_id
        });
      }
    });

    // Check if all projects have valid customers
    const projects = db.getAllProjects();
    projects.forEach(project => {
      if (!customerIds.has(project.customer_id)) {
        issues.push({
          type: 'missing_customer',
          project_id: project.id,
          customer_id: project.customer_id
        });
      }
    });

    if (issues.length > 0) {
      console.warn(`⚠️  Found ${issues.length} integrity issues:`);
      issues.forEach(issue => console.warn(`  - ${issue.type}:`, issue));
      return { valid: false, issues };
    }

    console.log('✅ Sync integrity validated');
    return { valid: true, issues: [] };
  }

  // ============================================
  // STATISTICS
  // ============================================

  getStats() {
    const stats = {
      database: {
        customers: db.getAllCustomers().length,
        invoices: db.getAllInvoices().length,
        projects: db.getAllProjects().length,
        expenses: db.getAllExpenses().length
      },
      json: {}
    };

    Object.entries(this.jsonFiles).forEach(([name, filePath]) => {
      if (fs.existsSync(filePath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          stats.json[name] = Array.isArray(data) ? data.length : 0;
        } catch (error) {
          stats.json[name] = 'error';
        }
      } else {
        stats.json[name] = 0;
      }
    });

    return stats;
  }

  printStats() {
    const stats = this.getStats();

    console.log('\n📊 Sync Statistics:');
    console.log('\n  Database:');
    Object.entries(stats.database).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });

    console.log('\n  JSON Files:');
    Object.entries(stats.json).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });
    console.log('');
  }
}

// Export singleton instance
export const dbSync = new DBSync();

// Also export the class
export { DBSync };
