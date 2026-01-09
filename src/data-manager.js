import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

class DataManager {
  constructor() {
    this.dataDir = path.join(ROOT_DIR, 'data');
    this.logsDir = path.join(ROOT_DIR, 'logs');
  }

  // Generic file operations
  async readJSON(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async writeJSON(filePath, data) {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async listJSONFiles(dir) {
    try {
      const files = await fs.readdir(dir);
      return files.filter(f => f.endsWith('.json') && f !== '.gitkeep');
    } catch (error) {
      return [];
    }
  }

  // Customers
  async listCustomers() {
    const dir = path.join(this.dataDir, 'customers');
    const files = await this.listJSONFiles(dir);
    const customers = await Promise.all(
      files.map(f => this.readJSON(path.join(dir, f)))
    );
    return customers.filter(Boolean);
  }

  async getCustomer(id) {
    const filePath = path.join(this.dataDir, 'customers', `${id}.json`);
    return await this.readJSON(filePath);
  }

  async saveCustomer(customer) {
    customer.updated = new Date().toISOString();
    if (!customer.created) {
      customer.created = customer.updated;
    }
    const filePath = path.join(this.dataDir, 'customers', `${customer.id}.json`);
    await this.writeJSON(filePath, customer);
    return customer;
  }

  // Invoices
  async listInvoices() {
    const dir = path.join(this.dataDir, 'invoices');
    const files = await this.listJSONFiles(dir);
    const invoices = await Promise.all(
      files.map(f => this.readJSON(path.join(dir, f)))
    );
    return invoices.filter(Boolean);
  }

  async getInvoice(id) {
    const filePath = path.join(this.dataDir, 'invoices', `${id}.json`);
    return await this.readJSON(filePath);
  }

  async saveInvoice(invoice) {
    invoice.updated = new Date().toISOString();
    if (!invoice.created) {
      invoice.created = invoice.updated;
    }
    const filePath = path.join(this.dataDir, 'invoices', `${invoice.id}.json`);
    await this.writeJSON(filePath, invoice);
    return invoice;
  }

  async getNextInvoiceNumber() {
    const invoices = await this.listInvoices();
    const year = new Date().getFullYear();
    const yearInvoices = invoices.filter(inv =>
      inv.invoiceNumber && inv.invoiceNumber.startsWith(String(year))
    );

    if (yearInvoices.length === 0) {
      return `${year}-001`;
    }

    const numbers = yearInvoices.map(inv => {
      const parts = inv.invoiceNumber.split('-');
      return parseInt(parts[1] || '0', 10);
    });

    const maxNumber = Math.max(...numbers);
    return `${year}-${String(maxNumber + 1).padStart(3, '0')}`;
  }

  // Projects
  async listProjects() {
    const dir = path.join(this.dataDir, 'projects');
    const files = await this.listJSONFiles(dir);
    const projects = await Promise.all(
      files.map(f => this.readJSON(path.join(dir, f)))
    );
    return projects.filter(Boolean);
  }

  async getProject(id) {
    const filePath = path.join(this.dataDir, 'projects', `${id}.json`);
    return await this.readJSON(filePath);
  }

  async saveProject(project) {
    project.updated = new Date().toISOString();
    if (!project.created) {
      project.created = project.updated;
    }
    const filePath = path.join(this.dataDir, 'projects', `${project.id}.json`);
    await this.writeJSON(filePath, project);
    return project;
  }

  // Logs
  async getLog(date) {
    const filePath = path.join(this.logsDir, `${date}.md`);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async saveLog(date, content) {
    const filePath = path.join(this.logsDir, `${date}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async appendLog(date, entry) {
    let content = await this.getLog(date);
    if (!content) {
      content = `# ${date}\n\n`;
    }
    content += `\n${entry}\n`;
    await this.saveLog(date, content);
  }

  // Utility
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'a')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const dataManager = new DataManager();
