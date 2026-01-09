import axios from 'axios';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';

dotenv.config();

class FikenClient {
  constructor() {
    this.apiToken = process.env.FIKEN_API_TOKEN;
    this.companySlug = process.env.FIKEN_COMPANY_SLUG;
    this.baseURL = 'https://api.fiken.no/api/v2';

    if (!this.apiToken || !this.companySlug) {
      console.warn(chalk.yellow('\n⚠️  Fiken API ikke konfigurert. Legg til FIKEN_API_TOKEN og FIKEN_COMPANY_SLUG i .env\n'));
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  isConfigured() {
    return !!(this.apiToken && this.companySlug);
  }

  // Company endpoint wrapper
  companyEndpoint(path) {
    return `/companies/${this.companySlug}${path}`;
  }

  // Get all contacts (customers) with pagination
  async getContacts() {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    const spinner = ora('Henter kontakter fra Fiken...').start();

    try {
      let allContacts = [];
      let page = 0;
      let hasMore = true;

      // Fetch all pages
      while (hasMore) {
        const response = await this.client.get(
          this.companyEndpoint('/contacts'),
          { params: { page, pageSize: 100 } }
        );

        const contacts = response.data;
        allContacts = allContacts.concat(contacts);

        spinner.text = `Henter kontakter fra Fiken... (${allContacts.length} så langt)`;

        // Check if there are more pages
        if (contacts.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      spinner.succeed(`Hentet ${allContacts.length} kontakter fra Fiken`);
      return allContacts;
    } catch (error) {
      spinner.fail('Feil ved henting av kontakter');
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get single contact by ID
  async getContact(contactId) {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    try {
      const response = await this.client.get(
        this.companyEndpoint(`/contacts/${contactId}`)
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get all invoices
  async getInvoices(params = {}) {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    const spinner = ora('Henter fakturaer fra Fiken...').start();

    try {
      let allInvoices = [];
      let page = 0;
      let hasMore = true;

      // Fetch all pages
      while (hasMore) {
        const response = await this.client.get(
          this.companyEndpoint('/invoices'),
          { params: { ...params, page, pageSize: 100 } }
        );

        const invoices = response.data;
        allInvoices = allInvoices.concat(invoices);

        spinner.text = `Henter fakturaer fra Fiken... (${allInvoices.length} så langt)`;

        // Check if there are more pages
        if (invoices.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      spinner.succeed(`Hentet ${allInvoices.length} fakturaer fra Fiken`);
      return allInvoices;
    } catch (error) {
      spinner.fail('Feil ved henting av fakturaer');
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get single invoice
  async getInvoice(invoiceId) {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    try {
      const response = await this.client.get(
        this.companyEndpoint(`/invoices/${invoiceId}`)
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Create draft invoice
  async createDraftInvoice(invoiceData) {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    const spinner = ora('Oppretter faktura i Fiken...').start();

    try {
      const response = await this.client.post(
        this.companyEndpoint('/invoices'),
        invoiceData
      );

      spinner.succeed('Faktura opprettet i Fiken');
      return response.data;
    } catch (error) {
      spinner.fail('Feil ved oppretting av faktura');
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get projects
  async getProjects() {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    const spinner = ora('Henter prosjekter fra Fiken...').start();

    try {
      const response = await this.client.get(
        this.companyEndpoint('/projects')
      );

      spinner.succeed(`Hentet ${response.data.length} prosjekter fra Fiken`);
      return response.data;
    } catch (error) {
      spinner.fail('Feil ved henting av prosjekter');
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get bank accounts
  async getBankAccounts() {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    try {
      const response = await this.client.get(
        this.companyEndpoint('/bankAccounts')
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get products/services
  async getProducts() {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    try {
      const response = await this.client.get(
        this.companyEndpoint('/products')
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Get bank balances
  async getBankBalances(date = null) {
    if (!this.isConfigured()) {
      throw new Error('Fiken API ikke konfigurert');
    }

    try {
      const params = date ? { date } : {};
      const response = await this.client.get(
        this.companyEndpoint('/bankBalances'),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red(error.response?.data?.message || error.message));
      throw error;
    }
  }

  // Helper: Convert Fiken contact to our customer format
  fikenContactToCustomer(fikenContact) {
    return {
      id: this.slugify(fikenContact.name),
      name: fikenContact.name,
      orgNr: fikenContact.organizationIdentifier || null,
      contact: {
        name: fikenContact.name,
        email: fikenContact.email || '',
        phone: fikenContact.phoneNumber || ''
      },
      address: {
        street: fikenContact.address?.streetAddress || '',
        postalCode: fikenContact.address?.postCode || '',
        city: fikenContact.address?.city || ''
      },
      fikenId: fikenContact.contactId,
      created: fikenContact.createdDate || new Date().toISOString(),
      updated: fikenContact.lastModifiedDate || new Date().toISOString(),
      notes: ''
    };
  }

  // Helper: Convert our invoice to Fiken invoice format
  invoiceToFikenFormat(invoice, customer) {
    return {
      issueDate: invoice.date,
      dueDate: invoice.dueDate,
      contactId: customer.fikenId,
      lines: invoice.items.map(item => ({
        description: item.description,
        quantity: item.hours || 1,
        unitPrice: item.rate || item.amount,
        vatType: 'HIGH' // 25% MVA
      })),
      bankAccountCode: null, // Set if you have specific bank account
      currency: 'NOK'
    };
  }

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

export const fikenClient = new FikenClient();
