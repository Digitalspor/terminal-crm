#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { dataManager } from './data-manager.js';
import { gitSync } from './git-sync.js';
import { fikenSync } from './fiken-sync.js';
import { notesManager } from './notes-manager.js';
import { userContext } from './user-context.js';
import { gmailClient } from './gmail-client.js';

const program = new Command();

program
  .name('crm')
  .description('Terminal CRM for digitale byråer')
  .version('0.1.0');

// Customers
program
  .command('customer:list')
  .alias('kunder')
  .description('List alle kunder')
  .action(async () => {
    const customers = await dataManager.listCustomers();
    console.log(chalk.bold('\n📋 Kunder:\n'));
    customers.forEach(c => {
      console.log(`${chalk.cyan(c.name)} (${c.id})`);
      console.log(`  📧 ${c.contact.email}`);
      console.log(`  📞 ${c.contact.phone}\n`);
    });
  });

program
  .command('customer:add')
  .description('Legg til ny kunde')
  .action(async () => {
    console.log(chalk.yellow('Bruk Claude Code med Canvas for å legge til kunde interaktivt'));
    console.log('Si: "Hjelp meg å legge til en ny kunde"');
  });

// Invoices
program
  .command('invoice:list')
  .alias('fakturaer')
  .description('List alle fakturaer')
  .action(async () => {
    const invoices = await dataManager.listInvoices();
    console.log(chalk.bold('\n💰 Fakturaer:\n'));
    invoices.forEach(inv => {
      const statusColor = inv.status === 'paid' ? 'green' : inv.status === 'sent' ? 'yellow' : 'white';
      console.log(`${chalk[statusColor](inv.invoiceNumber)} - ${inv.customerId}`);
      console.log(`  Beløp: ${chalk.bold(inv.total)} kr`);
      console.log(`  Status: ${inv.status}`);
      console.log(`  Forfallsdato: ${inv.dueDate}\n`);
    });
  });

// Projects
program
  .command('project:list')
  .alias('prosjekter')
  .description('List alle prosjekter')
  .action(async () => {
    const projects = await dataManager.listProjects();
    console.log(chalk.bold('\n🚀 Prosjekter:\n'));
    projects.forEach(p => {
      const statusColor = p.status === 'completed' ? 'green' : p.status === 'in-progress' ? 'cyan' : 'yellow';
      console.log(`${chalk[statusColor](p.name)} (${p.id})`);
      console.log(`  Status: ${p.status}`);
      console.log(`  Timer: ${p.spentHours}/${p.estimatedHours}h`);
      console.log(`  Kunde: ${p.customerId}\n`);
    });
  });

// Logs
program
  .command('log:today')
  .alias('logg')
  .description('Vis dagens logg')
  .action(async () => {
    const today = new Date().toISOString().split('T')[0];
    const log = await dataManager.getLog(today);
    if (log) {
      console.log(chalk.bold(`\n📝 Logg for ${today}:\n`));
      console.log(log);
    } else {
      console.log(chalk.yellow(`\nIngen logg for ${today} ennå.`));
    }
  });

// Git sync
program
  .command('sync')
  .description('Pull og push alle endringer')
  .action(async () => {
    await gitSync.pullAndPush();
  });

program
  .command('status')
  .description('Vis Git status')
  .action(async () => {
    await gitSync.status();
  });

// Fiken integration
program
  .command('fiken:sync-customers')
  .description('Sync kunder fra Fiken')
  .action(async () => {
    await fikenSync.syncCustomersFromFiken();
  });

program
  .command('fiken:sync-invoices')
  .option('-y, --year <year>', 'Filtrer på år')
  .description('Sync fakturaer fra Fiken')
  .action(async (options) => {
    await fikenSync.syncInvoicesFromFiken(options.year);
  });

program
  .command('fiken:push-invoice <invoiceId>')
  .description('Push faktura til Fiken')
  .action(async (invoiceId) => {
    await fikenSync.pushInvoiceToFiken(invoiceId);
  });

program
  .command('fiken:accounts')
  .description('Vis Fiken kontooversikt')
  .action(async () => {
    await fikenSync.getAccountOverview();
  });

// Notes
program
  .command('note:list <customerId>')
  .description('Vis notater på kunde')
  .action(async (customerId) => {
    const notes = await notesManager.getAllCustomerNotes(customerId);
    if (notes.length === 0) {
      console.log(chalk.yellow(`\nIngen notater for ${customerId}\n`));
      return;
    }

    console.log(chalk.bold(`\n📝 Notater for ${customerId}:\n`));
    notes.forEach(({ userId, content }) => {
      console.log(chalk.cyan(`\n=== ${userId} ===\n`));
      console.log(content);
    });
  });

program
  .command('note:mine <customerId>')
  .description('Vis dine notater på kunde')
  .action(async (customerId) => {
    const notes = await notesManager.getCustomerNotes(customerId);
    if (!notes) {
      console.log(chalk.yellow(`\nDu har ingen notater for ${customerId}\n`));
      return;
    }

    console.log(chalk.bold(`\n📝 Dine notater for ${customerId}:\n`));
    console.log(notes);
  });

// Reminders
program
  .command('reminder:list')
  .alias('påminnelser')
  .description('Vis dine påminnelser')
  .action(async () => {
    const reminders = await notesManager.getReminders();
    if (reminders.length === 0) {
      console.log(chalk.yellow('\nIngen påminnelser\n'));
      return;
    }

    console.log(chalk.bold('\n⏰ Dine påminnelser:\n'));
    const active = reminders.filter(r => !r.completed);
    const completed = reminders.filter(r => r.completed);

    if (active.length > 0) {
      console.log(chalk.bold('Aktive:\n'));
      active.forEach(r => {
        const dueDate = r.dueDate ? chalk.yellow(r.dueDate) : 'Ingen forfallsdato';
        console.log(`${chalk.cyan(`[${r.id}]`)} ${r.text}`);
        console.log(`  ${dueDate}`);
        if (r.customerId) console.log(`  Kunde: ${r.customerId}`);
        console.log('');
      });
    }

    if (completed.length > 0) {
      console.log(chalk.bold.gray('\nFullførte:\n'));
      completed.forEach(r => {
        console.log(chalk.gray(`${r.text} ✓`));
      });
    }
  });

// Calendar
program
  .command('calendar:upcoming')
  .alias('kalender')
  .option('-d, --days <days>', 'Antall dager fremover', '7')
  .description('Vis kommende hendelser')
  .action(async (options) => {
    const days = parseInt(options.days, 10);
    const events = await notesManager.getUpcomingEvents(days);

    if (events.length === 0) {
      console.log(chalk.yellow(`\nIngen hendelser neste ${days} dagene\n`));
      return;
    }

    console.log(chalk.bold(`\n📅 Kommende ${days} dager:\n`));
    events.forEach(e => {
      const date = new Date(e.date).toLocaleDateString('nb-NO');
      const time = e.time ? ` kl. ${e.time}` : '';
      console.log(`${chalk.cyan(date)}${time} - ${chalk.bold(e.title)}`);
      if (e.description) console.log(`  ${e.description}`);
      if (e.customerId) console.log(`  Kunde: ${e.customerId}`);
      console.log('');
    });
  });

// Gmail
program
  .command('gmail:auth')
  .description('Autentiser Gmail')
  .action(async () => {
    try {
      const { authUrl } = await gmailClient.getAuthUrl();
      console.log(chalk.bold('\n📧 Gmail Autentisering\n'));
      console.log('1. Åpne denne lenken i nettleseren:');
      console.log(chalk.cyan(authUrl));
      console.log('\n2. Godkjenn tilgang');
      console.log('3. Kopier authorization code fra URL');
      console.log('4. Kjør: npm run crm gmail:token <code>\n');
    } catch (error) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('gmail:token <code>')
  .description('Lagre Gmail token')
  .action(async (code) => {
    try {
      await gmailClient.authenticate(code);
    } catch (error) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('gmail:customer <customerId>')
  .description('Vis e-poster fra/til kunde')
  .action(async (customerId) => {
    try {
      const customer = await dataManager.getCustomer(customerId);
      if (!customer) {
        console.log(chalk.red(`Kunde ${customerId} ikke funnet`));
        return;
      }

      const emails = await gmailClient.getEmailsByCustomer(customer.contact.email);
      console.log(chalk.bold(`\n📧 E-poster med ${customer.name}:\n`));

      emails.forEach(email => {
        console.log(chalk.cyan(email.subject));
        console.log(`  Fra: ${email.from}`);
        console.log(`  Dato: ${email.date}`);
        console.log(`  ${chalk.gray(email.snippet)}\n`);
      });
    } catch (error) {
      console.error(chalk.red(error.message));
    }
  });

// User info
program
  .command('whoami')
  .description('Vis din Git-bruker')
  .action(async () => {
    try {
      const user = await userContext.getCurrentGitUser();
      console.log(chalk.bold('\n👤 Du er logget inn som:\n'));
      console.log(`Navn: ${chalk.cyan(user.name)}`);
      console.log(`E-post: ${chalk.cyan(user.email)}`);
      console.log(`ID: ${chalk.gray(user.id)}\n`);
    } catch (error) {
      console.error(chalk.red(error.message));
    }
  });

// Interactive mode
if (process.argv.length === 2) {
  console.log(chalk.bold.cyan('\n🎯 CRM Terminal\n'));
  console.log(chalk.bold('Data:'));
  console.log('  npm run crm kunder            - List kunder');
  console.log('  npm run crm fakturaer         - List fakturaer');
  console.log('  npm run crm prosjekter        - List prosjekter');
  console.log('  npm run crm logg              - Vis dagens logg');
  console.log('');
  console.log(chalk.bold('Personlig:'));
  console.log('  npm run crm påminnelser       - Dine påminnelser');
  console.log('  npm run crm kalender          - Din kalender (7 dager)');
  console.log('  npm run crm note:mine <id>    - Dine notater på kunde');
  console.log('  npm run crm whoami            - Vis din Git-bruker');
  console.log('');
  console.log(chalk.bold('Fiken:'));
  console.log('  npm run crm fiken:sync-customers    - Sync kunder');
  console.log('  npm run crm fiken:sync-invoices     - Sync fakturaer');
  console.log('  npm run crm fiken:push-invoice <id> - Push faktura');
  console.log('  npm run crm fiken:accounts          - Vis kontoer');
  console.log('');
  console.log(chalk.bold('Gmail:'));
  console.log('  npm run crm gmail:auth              - Autentiser Gmail');
  console.log('  npm run crm gmail:customer <id>     - E-poster med kunde');
  console.log('');
  console.log(chalk.bold('Git:'));
  console.log('  npm run crm sync            - Pull og push');
  console.log('  npm run crm status          - Git status');
  console.log('\n💡 Bruk Claude Code for interaktiv bruk med Canvas!\n');
}

program.parse();
