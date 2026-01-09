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

    try {
      const params = year ? { issuedDateFrom: `${year}-01-01`, issuedDateTo: `${year}-12-31` } : {};
      const fikenInvoices = await fikenClient.getInvoices(params);

      console.log(chalk.gray(`Hentet ${fikenInvoices.length} fakturaer fra Fiken`));
      console.log(chalk.yellow('⚠️  Manuell mapping av fakturaer kreves (WIP)'));

      // TODO: Implement full invoice sync
      // Fakturaer i Fiken har annen struktur enn vårt format
      // Vi må mappe mellom formatene

      console.log(chalk.green('\n✓ Faktura-sync fullført (preview)!\n'));
    } catch (error) {
      console.error(chalk.red('\n✗ Faktura-sync feilet:', error.message, '\n'));
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
