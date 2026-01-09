#!/usr/bin/env node
import { fikenSync } from './fiken-sync.js';
import chalk from 'chalk';

const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

console.log(chalk.bold.cyan('\n🔄 Fiken Auto-Sync startet'));
console.log(chalk.gray(`Synkroniserer hver 30. minutt\n`));

// Initial sync
async function runSync() {
  const timestamp = new Date().toLocaleTimeString('nb-NO');
  console.log(chalk.blue(`[${timestamp}] Starter sync...`));

  try {
    // Sync customers
    await fikenSync.syncCustomersFromFiken();

    // Sync invoices
    await fikenSync.syncInvoicesFromFiken();

    console.log(chalk.green(`[${timestamp}] ✅ Sync fullført\n`));
  } catch (error) {
    console.error(chalk.red(`[${timestamp}] ❌ Sync feilet: ${error.message}\n`));
  }
}

// Run initial sync
runSync();

// Schedule recurring sync
setInterval(runSync, SYNC_INTERVAL);

console.log(chalk.yellow('Trykk Ctrl+C for å stoppe auto-sync\n'));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Stopper auto-sync...'));
  process.exit(0);
});
