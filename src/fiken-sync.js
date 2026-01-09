import { fikenClient } from './fiken-client.js';
import { dataManager } from './data-manager.js';
import { gitSync } from './git-sync.js';
import chalk from 'chalk';
import ora from 'ora';

class FikenSync {
  // Sync customers from Fiken to local
  async syncCustomersFromFiken() {
    if (!fikenClient.isConfigured()) {
      console.log(chalk.yellow('Fiken API ikke konfigurert. Hopp over sync.'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔄 Synkroniserer kunder fra Fiken...\n'));

    try {
      const fikenContacts = await fikenClient.getContacts();

      const spinner = ora('Lagrer kunder lokalt...').start();
      let newCount = 0;
      let updatedCount = 0;

      for (const contact of fikenContacts) {
        const customer = fikenClient.fikenContactToCustomer(contact);
        const existing = await dataManager.getCustomer(customer.id);

        if (!existing) {
          newCount++;
        } else {
          updatedCount++;
        }

        await dataManager.saveCustomer(customer);
      }

      spinner.succeed(`Lagret ${fikenContacts.length} kunder (${newCount} nye, ${updatedCount} oppdatert)`);

      // Commit and push
      if (newCount > 0 || updatedCount > 0) {
        await gitSync.commitAndPush(
          `customer: Sync ${fikenContacts.length} kunder fra Fiken (${newCount} nye, ${updatedCount} oppdatert)`
        );
      }

      console.log(chalk.green('\n✓ Kunde-sync fullført!\n'));
    } catch (error) {
      console.error(chalk.red('\n✗ Kunde-sync feilet:', error.message, '\n'));
    }
  }

  // Sync invoices from Fiken to local
  async syncInvoicesFromFiken(year) {
    if (!fikenClient.isConfigured()) {
      console.log(chalk.yellow('Fiken API ikke konfigurert. Hopp over sync.'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔄 Synkroniserer fakturaer fra Fiken...\n'));

    const spinner = ora('Henter fakturaer fra Fiken...').start();

    try {
      const params = year ? { issuedDateFrom: `${year}-01-01`, issuedDateTo: `${year}-12-31` } : {};
      const fikenInvoices = await fikenClient.getInvoices(params);

      spinner.succeed(`Hentet ${fikenInvoices.length} fakturaer fra Fiken`);

      // Load all customers to map contactId -> customerId
      const customers = await dataManager.listCustomers();
      const customersByFikenId = {};
      customers.forEach(c => {
        if (c.fikenId) {
          customersByFikenId[c.fikenId] = c;
        }
      });

      spinner.start('Mapper og lagrer fakturaer...');

      let newCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      for (const fikenInv of fikenInvoices) {
        // Find customer by Fiken contact ID
        const customer = customersByFikenId[fikenInv.contactId];

        if (!customer) {
          skippedCount++;
          continue; // Skip if customer not found
        }

        // Map Fiken invoice to CRM format
        const invoiceId = fikenInv.invoiceNumber || `fiken-${fikenInv.invoiceId}`;
        const existingInvoice = await dataManager.getInvoice(invoiceId);

        const invoice = {
          id: invoiceId,
          customerId: customer.id,
          invoiceNumber: fikenInv.invoiceNumber,
          date: fikenInv.issueDate || fikenInv.date,
          dueDate: fikenInv.dueDate,
          status: fikenInv.settled ? 'paid' : (fikenInv.sent ? 'sent' : 'draft'),
          items: (fikenInv.lines || []).map(line => ({
            description: line.description || line.productName || 'Tjeneste',
            hours: line.quantity || 0,
            rate: line.unitPrice || 0,
            amount: line.netAmount || (line.quantity * line.unitPrice) || 0
          })),
          subtotal: fikenInv.netAmount || 0,
          vat: fikenInv.vatAmount || 0,
          total: fikenInv.grossAmount || fikenInv.totalAmount || 0,
          fikenId: fikenInv.invoiceId,
          fikenSynced: true,
          notes: fikenInv.comment || null,
          created: existingInvoice?.created || new Date().toISOString(),
          updated: new Date().toISOString()
        };

        await dataManager.saveInvoice(invoice);

        if (existingInvoice) {
          updatedCount++;
        } else {
          newCount++;
        }
      }

      spinner.succeed(`Lagret ${fikenInvoices.length} fakturaer (${newCount} nye, ${updatedCount} oppdatert, ${skippedCount} hoppet over)`);

      // Commit changes
      spinner.start('Committer endringer...');
      await gitSync.commitAndPush(
        `invoice: Sync ${fikenInvoices.length} fakturaer fra Fiken (${newCount} nye, ${updatedCount} oppdatert)`
      );
      spinner.succeed('Committed og pushet til Git');

      console.log(chalk.green('\n✓ Faktura-sync fullført!\n'));

      if (skippedCount > 0) {
        console.log(chalk.yellow(`⚠️  ${skippedCount} fakturaer hoppet over (kunde ikke funnet i CRM)`));
        console.log(chalk.gray('Kjør: npm run crm fiken:sync-customers først\n'));
      }
    } catch (error) {
      spinner.fail('Faktura-sync feilet');
      console.error(chalk.red('\n✗ Feil:', error.message, '\n'));
    }
  }

  // Push invoice to Fiken
  async pushInvoiceToFiken(invoiceId) {
    if (!fikenClient.isConfigured()) {
      console.log(chalk.yellow('Fiken API ikke konfigurert.'));
      return;
    }

    console.log(chalk.bold.cyan(`\n📤 Pusher faktura ${invoiceId} til Fiken...\n`));

    try {
      const invoice = await dataManager.getInvoice(invoiceId);
      if (!invoice) {
        console.log(chalk.red(`Faktura ${invoiceId} finnes ikke`));
        return;
      }

      const customer = await dataManager.getCustomer(invoice.customerId);
      if (!customer || !customer.fikenId) {
        console.log(chalk.red(`Kunde ${invoice.customerId} mangler Fiken ID`));
        console.log(chalk.yellow('Kjør: npm run crm fiken:sync-customers først'));
        return;
      }

      const fikenInvoiceData = fikenClient.invoiceToFikenFormat(invoice, customer);
      const result = await fikenClient.createDraftInvoice(fikenInvoiceData);

      // Update local invoice with Fiken ID
      invoice.fikenId = result.invoiceId;
      invoice.fikenSynced = true;
      await dataManager.saveInvoice(invoice);

      await gitSync.commitAndPush(
        `invoice: Push faktura ${invoiceId} til Fiken (ID: ${result.invoiceId})`
      );

      console.log(chalk.green(`\n✓ Faktura ${invoiceId} pushet til Fiken!\n`));
      console.log(chalk.gray(`Fiken ID: ${result.invoiceId}`));
    } catch (error) {
      console.error(chalk.red('\n✗ Push til Fiken feilet:', error.message, '\n'));
    }
  }

  // Get account overview
  async getAccountOverview() {
    if (!fikenClient.isConfigured()) {
      console.log(chalk.yellow('Fiken API ikke konfigurert.'));
      return;
    }

    console.log(chalk.bold.cyan('\n💰 Fiken - Kontooversikt\n'));

    try {
      const accounts = await fikenClient.getBankAccounts();

      accounts.forEach(account => {
        console.log(`${chalk.bold(account.name)}`);
        console.log(`  Kontonummer: ${account.accountNumber || 'N/A'}`);
        console.log(`  Type: ${account.type || 'N/A'}\n`);
      });
    } catch (error) {
      console.error(chalk.red('Feil ved henting av kontoer:', error.message));
    }
  }
}

export const fikenSync = new FikenSync();
