import blessed from 'blessed';
import contrib from 'blessed-contrib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Helper functions to read data
function readJsonFiles(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  } catch (err) {
    return [];
  }
}

function getCustomers() {
  return readJsonFiles(path.join(dataDir, 'customers'));
}

function getProjects() {
  return readJsonFiles(path.join(dataDir, 'projects'));
}

function getInvoices() {
  return readJsonFiles(path.join(dataDir, 'invoices'));
}

function getExpenses() {
  return readJsonFiles(path.join(dataDir, 'expenses'));
}

// Create progress bar
function createProgressBar(percent) {
  const width = 20;
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  let color = percent < 33 ? 'red' : percent < 66 ? 'yellow' : 'green';
  return `{${color}-fg}${'█'.repeat(filled)}{/${color}-fg}{white-fg}${'░'.repeat(empty)}{/white-fg} ${percent}%`;
}

// Create the main screen
const screen = blessed.screen({
  smartCSR: true,
  title: '🎯 CRM Dashboard - Digitalspor',
  fullUnicode: true
});

// Current view state
let currentView = 'main';
let selectedCustomer = null;

// Status bar at top
const statusBar = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: 1,
  tags: true,
  style: {
    fg: 'black',
    bg: 'cyan'
  }
});

// Update status bar
function updateStatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('nb-NO', { weekday: 'short', day: '2-digit', month: 'short' });

  // Calculate revenue this month
  const invoices = getInvoices();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthRevenue = invoices
    .filter(i => {
      const invDate = new Date(i.date);
      return invDate.getMonth() === thisMonth && invDate.getFullYear() === thisYear && i.status !== 'draft';
    })
    .reduce((sum, i) => sum + i.total, 0) / 100; // Convert from øre to kr

  const content = ` 🕐 ${time} │ 📅 ${date} │ 💰 ${monthRevenue.toLocaleString('nb-NO')} kr denne måneden`;

  statusBar.setContent(content);
}

// Command prompt at bottom
const promptBox = blessed.textbox({
  bottom: 1,
  left: 0,
  width: '100%',
  height: 1,
  inputOnFocus: true,
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue'
  },
  content: ' 💬 Skriv kommando... (Ctrl+P for prompt)'
});

// Stats box for main menu
const statsBox = blessed.box({
  top: 2,
  left: 'center',
  width: '80%',
  height: 5,
  tags: true,
  border: {
    type: 'line',
    fg: 'cyan'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'cyan'
    }
  }
});

// Get overdue invoices
function getOverdueInvoices() {
  const invoices = getInvoices();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return invoices.filter(i => {
    if (i.status === 'paid') return false;
    if (!i.dueDate) return false;

    const dueDate = new Date(i.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  });
}

// Update stats
function updateStats() {
  const customers = getCustomers();
  const projects = getProjects();
  const invoices = getInvoices();
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;

  // Calculate overdue invoices
  const overdueInvoices = getOverdueInvoices();
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0) / 100; // Convert from øre to kr
  const overdueCount = overdueInvoices.length;

  const content = `{center}{bold}{cyan-fg}📊 QUICK STATS{/cyan-fg}{/bold}{/center}
{center}👥 {bold}${customers.length}{/bold} kunder  │  📁 {bold}${activeProjects}{/bold} aktive prosjekter  │  {red-fg}🔔 {bold}${overdueCount}{/bold} forfalte fakturaer ({bold}${overdueAmount.toLocaleString('nb-NO')} kr{/bold}){/red-fg}{/center}`;

  statsBox.setContent(content);
}

// Main menu box
const mainMenu = blessed.list({
  top: 8,
  left: 'center',
  width: '60%',
  height: 13,
  label: ' {bold}{cyan-fg}🎯 HOVEDMENY{/cyan-fg}{/bold} ',
  tags: true,
  border: {
    type: 'double',
    fg: 'cyan'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'cyan'
    },
    selected: {
      bg: 'cyan',
      fg: 'black',
      bold: true
    },
    item: {
      fg: 'white'
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  interactive: true,
  items: [
    '{center}👥  KUNDER{/center}',
    '{center}💰  ØKONOMI{/center}',
    '{center}📁  PROSJEKTER{/center}',
    '{center}📊  OVERSIKT{/center}',
    '{center}📝  NOTATER{/center}',
    '{center}📅  KALENDER{/center}',
    '',
    '{center}{red-fg}❌  AVSLUTT{/red-fg}{/center}'
  ]
});

// Customer list view - using blessed.list for better interactivity
const customerList = blessed.list({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{green-fg}👥 KUNDER{/green-fg}{/bold} (↑↓: navigér │ Enter: detaljer │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'green'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'green'
    },
    selected: {
      bg: 'green',
      fg: 'white',
      bold: true
    },
    item: {
      fg: 'white'
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  interactive: true,
  hidden: true
});

// Customer detail view
const customerDetail = blessed.box({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{yellow-fg}📋 KUNDEDETALJER{/yellow-fg}{/bold} (↑↓: scroll │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'double',
    fg: 'yellow'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    }
  },
  keys: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: '█',
    fg: 'yellow'
  },
  hidden: true
});

// Economy submenu
const economyMenu = blessed.list({
  top: 1,
  left: '20%',
  width: '60%',
  height: 10,
  label: ' {bold}{yellow-fg}ØKONOMI{/yellow-fg}{/bold} (↑↓: navigér │ Enter: velg │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'double',
    fg: 'yellow'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    selected: {
      bg: 'yellow',
      fg: 'black',
      bold: true
    },
    item: {
      fg: 'white'
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  interactive: true,
  items: [
    '{center}FAKTURAER{/center}',
    '{center}KONTOER & SALDO{/center}',
    '{center}{red-fg}PURRING{/red-fg}{/center}'
  ],
  hidden: true
});

// Project list view with table
const projectTable = contrib.table({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{magenta-fg}📁 PROSJEKTER{/magenta-fg}{/bold} (↑↓: navigér │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'magenta'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'magenta'
    },
    header: {
      fg: 'magenta',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'magenta',
        fg: 'black'
      }
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  columnSpacing: 2,
  columnWidth: [35, 25, 45, 15],
  hidden: true
});

// Invoice list view with table
const invoiceTable = contrib.table({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{yellow-fg}💰 ØKONOMI - FAKTURAER{/yellow-fg}{/bold} (↑↓: navigér │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'yellow'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    header: {
      fg: 'yellow',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'yellow',
        fg: 'black'
      }
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  columnSpacing: 3,
  columnWidth: [15, 30, 20, 20, 15],
  hidden: true
});

// Accounts list view with table
const accountsTable = contrib.table({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{yellow-fg}🏦 ØKONOMI - KONTOER & SALDO{/yellow-fg}{/bold} (↑↓: navigér │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'yellow'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    header: {
      fg: 'yellow',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'yellow',
        fg: 'black'
      }
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  columnSpacing: 5,
  columnWidth: [30, 30, 30, 30],
  hidden: true
});

// Overdue invoices table for purring
const overdueTable = contrib.table({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{red-fg}🔔 PURRING - FORFALTE FAKTURAER{/red-fg}{/bold} (↑↓: navigér │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'red'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'red'
    },
    header: {
      fg: 'red',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'red',
        fg: 'white'
      }
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  columnSpacing: 3,
  columnWidth: [12, 25, 12, 15, 12, 12],
  hidden: true
});

// Expenses table
const expensesTable = contrib.table({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{magenta-fg}💵 KOSTNADER - MÅNEDLIG OVERSIKT{/magenta-fg}{/bold} (↑↓: navigér │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'line',
    fg: 'magenta'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'magenta'
    },
    header: {
      fg: 'magenta',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'magenta',
        fg: 'white'
      }
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  columnSpacing: 3,
  columnWidth: [12, 30, 15, 12, 20],
  hidden: true
});

// Overview box
const overviewBox = blessed.box({
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-2',
  label: ' {bold}{cyan-fg}📊 OVERSIKT{/cyan-fg}{/bold} (↑↓: scroll │ ESC: tilbake) ',
  tags: true,
  border: {
    type: 'double',
    fg: 'cyan'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'cyan'
    }
  },
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: '█',
    fg: 'cyan'
  },
  keys: true,
  hidden: true
});

// Add all elements to screen
screen.append(statusBar);
screen.append(statsBox);
screen.append(mainMenu);
screen.append(customerList);
screen.append(customerDetail);
screen.append(economyMenu);
screen.append(projectTable);
screen.append(invoiceTable);
screen.append(accountsTable);
screen.append(overdueTable);
screen.append(expensesTable);
screen.append(overviewBox);
screen.append(promptBox);

// Update status bar every second
setInterval(() => {
  updateStatusBar();
  screen.render();
}, 1000);

// Show main menu and update stats
updateStats();
updateStatusBar();
mainMenu.focus();

// Main menu selection handler function
function handleMenuSelection() {
  const selected = mainMenu.selected;
  const item = mainMenu.getItem(selected);
  if (!item) {
    promptBox.setContent(' ⚠️ DEBUG: No item found at index ' + selected);
    screen.render();
    return;
  }

  const text = item.getText().trim().toUpperCase();

  if (text.includes('AVSLUTT')) {
    return process.exit(0);
  }

  if (text.includes('KUNDER')) {
    showCustomers();
  } else if (text.includes('ØKONOMI')) {
    showEconomy();
  } else if (text.includes('PROSJEKTER')) {
    showProjects();
  } else if (text.includes('OVERSIKT')) {
    showOverview();
  } else if (text.includes('NOTATER')) {
    showMessage('📝 Notater', 'Notater-funksjonen kommer snart!');
  } else if (text.includes('KALENDER')) {
    showMessage('📅 Kalender', 'Kalender-funksjonen kommer snart!');
  }
}

// Try both select event and enter key
mainMenu.on('select', handleMenuSelection);
mainMenu.key(['enter', 'return'], handleMenuSelection);

// Show customers
function showCustomers() {
  currentView = 'customers';
  const customers = getCustomers();
  customersCache = customers; // Store for selection handler
  const projects = getProjects();
  const invoices = getInvoices();

  const items = customers.map(c => {
    const customerProjects = projects.filter(p => p.customerId === c.id).length;
    const customerInvoices = invoices.filter(i => i.customerId === c.id).length;
    return `{cyan-fg}${c.name}{/cyan-fg} - ${c.contact.name} (${c.contact.email}) - ${customerProjects}p / ${customerInvoices}f`;
  });

  customerList.setItems(items);
  customerList.select(0);

  statsBox.hide();
  mainMenu.hide();
  customerList.show();
  customerList.focus();
  screen.render();
}

// Show customer detail
function showCustomerDetail(customer) {
  currentView = 'customer-detail';

  const projects = getProjects().filter(p => p.customerId === customer.id);
  const invoices = getInvoices().filter(i => i.customerId === customer.id);

  let content = `\n  {center}{bold}{cyan-fg}═══ ${customer.name.toUpperCase()} ═══{/cyan-fg}{/bold}{/center}\n\n`;

  content += `  {bold}{green-fg}┌─ KONTAKTINFORMASJON{/green-fg}{/bold}\n`;
  content += `  │ {bold}Navn:{/bold}     ${customer.contact.name}\n`;
  content += `  │ {bold}E-post:{/bold}   ${customer.contact.email}\n`;
  content += `  │ {bold}Telefon:{/bold}  ${customer.contact.phone}\n`;
  content += `  │ {bold}Org.nr:{/bold}   ${customer.orgNr}\n`;
  content += `  │\n`;
  content += `  │ {bold}Adresse:{/bold}  ${customer.address.street}\n`;
  content += `  │            ${customer.address.postalCode} ${customer.address.city}\n`;
  content += `  {bold}{green-fg}└─{/green-fg}{/bold}\n\n`;

  if (customer.notes) {
    content += `  {bold}{yellow-fg}┌─ NOTATER{/yellow-fg}{/bold}\n`;
    content += `  │ ${customer.notes}\n`;
    content += `  {bold}{yellow-fg}└─{/yellow-fg}{/bold}\n\n`;
  }

  content += `  {bold}{magenta-fg}┌─ PROSJEKTER ({${projects.length}}){/magenta-fg}{/bold}\n`;
  if (projects.length === 0) {
    content += `  │ {gray-fg}Ingen prosjekter enda{/gray-fg}\n`;
  } else {
    projects.forEach(p => {
      const progress = Math.round((p.spentHours / p.estimatedHours) * 100);
      const statusIcon = p.status === 'completed' ? '✅' : '🔄';
      content += `  │ ${statusIcon} {bold}${p.name}{/bold}\n`;
      content += `  │    ${createProgressBar(progress)}\n`;
      content += `  │    ${p.spentHours}/${p.estimatedHours}t · ${p.budget.toLocaleString('nb-NO')} kr\n`;
    });
  }
  content += `  {bold}{magenta-fg}└─{/magenta-fg}{/bold}\n\n`;

  // Group invoices by year and month
  const invoicesByYear = {};
  invoices.forEach(inv => {
    const date = new Date(inv.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!invoicesByYear[year]) {
      invoicesByYear[year] = {};
    }
    if (!invoicesByYear[year][month]) {
      invoicesByYear[year][month] = [];
    }
    invoicesByYear[year][month].push(inv);
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0) / 100; // Convert from øre to kr
  content += `  {bold}{yellow-fg}┌─ FAKTURA-HISTORIKK ({${invoices.length}} · ${totalAmount.toLocaleString('nb-NO')} kr totalt){/yellow-fg}{/bold}\n`;

  if (invoices.length === 0) {
    content += `  │ {gray-fg}Ingen fakturaer enda{/gray-fg}\n`;
  } else {
    const years = Object.keys(invoicesByYear).sort((a, b) => b - a);

    years.forEach((year, yearIdx) => {
      const yearInvoices = Object.values(invoicesByYear[year]).flat();
      const yearTotal = yearInvoices.reduce((sum, inv) => sum + inv.total, 0) / 100; // Convert from øre to kr

      content += `  │\n`;
      content += `  │ {bold}{cyan-fg}${year}:{/cyan-fg}{/bold} ${yearTotal.toLocaleString('nb-NO')} kr (${yearInvoices.length} fakturaer)\n`;
      content += `  │ {cyan-fg}${'─'.repeat(50)}{/cyan-fg}\n`;

      const months = Object.keys(invoicesByYear[year]).sort((a, b) => b - a);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

      months.forEach(month => {
        const monthInvoices = invoicesByYear[year][month];
        const monthTotal = monthInvoices.reduce((sum, inv) => sum + inv.total, 0) / 100; // Convert from øre to kr

        content += `  │   {bold}${monthNames[month]}:{/bold} ${monthTotal.toLocaleString('nb-NO')} kr\n`;

        monthInvoices.forEach(inv => {
          const statusIcon = inv.status === 'draft' ? '📝' : inv.status === 'sent' ? '📤' : '✅';
          const statusColor = inv.status === 'draft' ? 'white' : inv.status === 'sent' ? 'yellow' : 'green';
          const invTotal = (inv.total / 100).toLocaleString('nb-NO'); // Convert from øre to kr
          content += `  │     ${statusIcon} {bold}${inv.invoiceNumber}{/bold} │ {${statusColor}-fg}${invTotal} kr{/${statusColor}-fg} │ ${inv.dueDate}\n`;
        });
      });
    });
  }
  content += `  {bold}{yellow-fg}└─{/yellow-fg}{/bold}\n`;

  customerDetail.setContent(content);
  customerList.hide();
  customerDetail.show();
  customerDetail.focus();
  screen.render();
}

// Customer list selection - much simpler with blessed.list!
let customersCache = [];

customerList.on('select', (item, index) => {
  if (customersCache[index]) {
    selectedCustomer = customersCache[index];
    showCustomerDetail(selectedCustomer);
  }
});

// Show projects
function showProjects() {
  currentView = 'projects';
  const projects = getProjects();
  const customers = getCustomers();

  const data = [
    ['PROSJEKT', 'KUNDE', 'FREMDRIFT', 'STATUS']
  ];

  projects.forEach(p => {
    const customer = customers.find(c => c.id === p.customerId);
    const progress = Math.round((p.spentHours / p.estimatedHours) * 100);
    const statusIcon = p.status === 'completed' ? '✅' : '🔄';
    const progressBar = `${'█'.repeat(Math.round(progress/5))}${'░'.repeat(20-Math.round(progress/5))} ${progress}%`;
    data.push([
      p.name,
      customer?.name || p.customerId,
      progressBar,
      `${statusIcon} ${p.status}`
    ]);
  });

  projectTable.setData(data);

  statsBox.hide();
  mainMenu.hide();
  projectTable.show();
  projectTable.focus();
  screen.render();
}

// Show economy submenu
function showEconomy() {
  currentView = 'economy';
  statsBox.hide();
  mainMenu.hide();
  economyMenu.show();
  economyMenu.focus();
  screen.render();
}

// Show accounts and balances
async function showAccounts() {
  currentView = 'accounts';

  // Show loading message
  promptBox.setContent(' ⏳ Henter kontoer fra Fiken...');
  screen.render();

  try {
    // Import Fiken client
    const { fikenClient } = await import('./fiken-client.js');

    // Check if configured
    if (!fikenClient.isConfigured()) {
      promptBox.setContent(' ⚠️ Fiken API ikke konfigurert - se .env fil');
      screen.render();
      setTimeout(() => {
        promptBox.setContent(' 💬 Skriv kommando... (Ctrl+P for prompt)');
        screen.render();
      }, 3000);
      return;
    }

    // Fetch bank accounts and balances
    const accounts = await fikenClient.getBankAccounts();
    const balances = await fikenClient.getBankBalances();

    const data = [
      ['KONTO', 'TYPE', 'SALDO', 'KONTONUMMER']
    ];

    accounts.forEach(acc => {
      const balance = balances.find(b => b.bankAccountId === acc.bankAccountId);
      const saldo = balance ? `${balance.balance.toLocaleString('nb-NO')} kr` : 'N/A';

      data.push([
        acc.name || 'Ukjent',
        acc.type || 'normal',
        saldo,
        acc.accountNumber || 'N/A'
      ]);
    });

    accountsTable.setData(data);

    economyMenu.hide();
    accountsTable.show();
    accountsTable.focus();
    promptBox.setContent(' ✅ Kontoer hentet fra Fiken');
    screen.render();
  } catch (error) {
    promptBox.setContent(` ⚠️ Feil: ${error.message}`);
    screen.render();
    setTimeout(() => {
      promptBox.setContent(' 💬 Skriv kommando... (Ctrl+P for prompt)');
      economyMenu.focus();
      screen.render();
    }, 3000);
  }
}

// Show invoices
function showInvoices() {
  currentView = 'invoices';
  const invoices = getInvoices();
  const customers = getCustomers();

  const data = [
    ['FAKTURA', 'KUNDE', 'BELØP', 'FORFALLER', 'STATUS']
  ];

  invoices.forEach(inv => {
    const customer = customers.find(c => c.id === inv.customerId);
    const statusIcon = inv.status === 'draft' ? '📝' : inv.status === 'sent' ? '📤' : '✅';
    const invTotal = (inv.total / 100).toLocaleString('nb-NO'); // Convert from øre to kr
    data.push([
      inv.invoiceNumber,
      customer?.name || inv.customerId,
      `${invTotal} kr`,
      inv.dueDate,
      `${statusIcon} ${inv.status}`
    ]);
  });

  invoiceTable.setData(data);

  statsBox.hide();
  mainMenu.hide();
  invoiceTable.show();
  invoiceTable.focus();
  screen.render();
}

// Show overdue invoices (Purring)
function showOverdueInvoices() {
  currentView = 'overdue';
  const overdueInvs = getOverdueInvoices();
  const customers = getCustomers();

  const data = [
    ['FAKTURA', 'KUNDE', 'BELØP', 'FORFALT', 'DAGER', 'STATUS']
  ];

  // Sort by due date (oldest first)
  overdueInvs.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  overdueInvs.forEach(inv => {
    const customer = customers.find(c => c.id === inv.customerId);
    const invTotal = (inv.total / 100).toLocaleString('nb-NO'); // Convert from øre to kr

    // Calculate days overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(inv.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    const statusIcon = inv.status === 'sent' ? '📤' : '📝';

    data.push([
      inv.invoiceNumber,
      customer?.name || inv.customerId,
      `${invTotal} kr`,
      inv.dueDate,
      `${daysOverdue}d`,
      `${statusIcon} ${inv.status}`
    ]);
  });

  overdueTable.setData(data);

  economyMenu.hide();
  overdueTable.show();
  overdueTable.focus();
  screen.render();
}

// Show expenses (Kostnader)
function showExpenses() {
  currentView = 'expenses';
  const expenses = getExpenses();

  const data = [
    ['DATO', 'BESKRIVELSE', 'KATEGORI', 'BELØP', 'BILAG/KVITTERING']
  ];

  // Group by month and sort by date (newest first)
  const expensesByMonth = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!expensesByMonth[yearMonth]) {
      expensesByMonth[yearMonth] = [];
    }
    expensesByMonth[yearMonth].push(exp);
  });

  // Sort months descending
  const months = Object.keys(expensesByMonth).sort((a, b) => b.localeCompare(a));

  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  months.forEach(yearMonth => {
    const [year, month] = yearMonth.split('-');
    const monthName = monthNames[parseInt(month) - 1];
    const monthExpenses = expensesByMonth[yearMonth];

    // Sort by date within month
    monthExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate month total
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Add month header
    data.push([
      '',
      `{bold}{cyan-fg}${monthName} ${year} - TOTAL: ${monthTotal.toLocaleString('nb-NO')} kr{/cyan-fg}{/bold}`,
      '',
      '',
      ''
    ]);

    // Add expenses for this month
    monthExpenses.forEach(exp => {
      const expAmount = exp.amount.toLocaleString('nb-NO');
      const receipt = exp.receiptFile || exp.receiptNumber || '-';

      data.push([
        exp.date,
        exp.description,
        exp.category || '-',
        `${expAmount} kr`,
        receipt
      ]);
    });

    // Add separator
    data.push(['', '', '', '', '']);
  });

  if (expenses.length === 0) {
    data.push(['', '{gray-fg}Ingen kostnader registrert enda{/gray-fg}', '', '', '']);
  }

  expensesTable.setData(data);

  economyMenu.hide();
  expensesTable.show();
  expensesTable.focus();
  screen.render();
}

// Show overview
function showOverview() {
  currentView = 'overview';
  const customers = getCustomers();
  const projects = getProjects();
  const invoices = getInvoices();

  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const draftInvoices = invoices.filter(i => i.status === 'draft');
  const outstanding = draftInvoices.reduce((sum, i) => sum + i.total, 0);

  let content = `{bold}{cyan-fg}📊 CRM Oversikt{/cyan-fg}{/bold}\n\n`;
  content += `{bold}Statistikk:{/bold}\n`;
  content += `  👥 Kunder: {green-fg}${customers.length}{/green-fg}\n`;
  content += `  📁 Aktive prosjekter: {magenta-fg}${activeProjects}{/magenta-fg}\n`;
  content += `  ✅ Fullførte prosjekter: {green-fg}${completedProjects}{/green-fg}\n`;
  content += `  💰 Utestående: {yellow-fg}${outstanding.toLocaleString('nb-NO')} kr{/yellow-fg}\n`;
  content += `  📄 Fakturaer: ${invoices.length} (${draftInvoices.length} draft)\n\n`;

  content += `{bold}Siste prosjekter:{/bold}\n`;
  projects.slice(-3).reverse().forEach(p => {
    const progress = Math.round((p.spentHours / p.estimatedHours) * 100);
    content += `  🔄 ${p.name} - ${progress}% fullført\n`;
  });

  content += `\n{bold}Siste fakturaer:{/bold}\n`;
  invoices.slice(-3).reverse().forEach(inv => {
    content += `  💰 ${inv.invoiceNumber} - ${inv.total.toLocaleString('nb-NO')} kr (${inv.status})\n`;
  });

  overviewBox.setContent(content);
  mainMenu.hide();
  overviewBox.show();
  overviewBox.focus();
  screen.render();
}

// Show message
function showMessage(title, message) {
  const msg = blessed.message({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: 'shrink',
    label: ` ${title} `,
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: 'green'
      }
    }
  });

  msg.display(message, 0, () => {
    msg.destroy();
    screen.render();
  });
}

// ESC key handling for going back
customerList.key(['escape', 'q'], () => {
  customerList.hide();
  statsBox.show();
  mainMenu.show();
  mainMenu.focus();
  currentView = 'main';
  screen.render();
});

customerDetail.key(['escape', 'q'], () => {
  customerDetail.hide();
  customerList.show();
  customerList.focus();
  currentView = 'customers';
  screen.render();
});

projectTable.key(['escape', 'q'], () => {
  projectTable.hide();
  statsBox.show();
  mainMenu.show();
  mainMenu.focus();
  currentView = 'main';
  screen.render();
});

invoiceTable.key(['escape', 'q'], () => {
  invoiceTable.hide();
  economyMenu.show();
  economyMenu.focus();
  currentView = 'economy';
  screen.render();
});

economyMenu.on('select', async (item, index) => {
  const text = item.getText().trim().toUpperCase();

  if (text.includes('FAKTURAER')) {
    economyMenu.hide();
    showInvoices();
  } else if (text.includes('KONTOER')) {
    await showAccounts();
  } else if (text.includes('PURRING')) {
    economyMenu.hide();
    showOverdueInvoices();
  }
});

economyMenu.key(['enter', 'return'], async () => {
  const selected = economyMenu.selected;
  const item = economyMenu.items[selected];
  if (!item) return;

  const text = item.getText().trim().toUpperCase();

  if (text.includes('FAKTURAER')) {
    economyMenu.hide();
    showInvoices();
  } else if (text.includes('KONTOER')) {
    await showAccounts();
  } else if (text.includes('PURRING')) {
    economyMenu.hide();
    showOverdueInvoices();
  }
});

economyMenu.key(['escape', 'q'], () => {
  economyMenu.hide();
  statsBox.show();
  mainMenu.show();
  mainMenu.focus();
  currentView = 'main';
  screen.render();
});

accountsTable.key(['escape', 'q'], () => {
  accountsTable.hide();
  economyMenu.show();
  economyMenu.focus();
  currentView = 'economy';
  screen.render();
});

overdueTable.key(['escape', 'q'], () => {
  overdueTable.hide();
  economyMenu.show();
  economyMenu.focus();
  currentView = 'economy';
  screen.render();
});

expensesTable.key(['escape', 'q'], () => {
  expensesTable.hide();
  economyMenu.show();
  economyMenu.focus();
  currentView = 'economy';
  screen.render();
});

overviewBox.key(['escape', 'q'], () => {
  overviewBox.hide();
  statsBox.show();
  mainMenu.show();
  mainMenu.focus();
  currentView = 'main';
  screen.render();
});

// Global quit
screen.key(['C-c'], () => {
  return process.exit(0);
});

// Refresh data (Ctrl+R)
screen.key(['C-r'], async () => {
  if (currentView === 'main') {
    updateStats();
    updateStatusBar();
  } else if (currentView === 'customers') {
    showCustomers();
  } else if (currentView === 'projects') {
    showProjects();
  } else if (currentView === 'invoices') {
    showInvoices();
  } else if (currentView === 'accounts') {
    await showAccounts();
  } else if (currentView === 'overdue') {
    showOverdueInvoices();
  } else if (currentView === 'expenses') {
    showExpenses();
  } else if (currentView === 'overview') {
    showOverview();
  }
  screen.render();
});

// Prompt handler (Ctrl+P)
screen.key(['C-p'], () => {
  promptBox.focus();
  promptBox.readInput((err, value) => {
    if (value) {
      // Handle commands here
      showMessage('Kommando', `Du skrev: ${value}\n\nKommandosystem kommer snart!`);
    }
    // Return to current view
    if (currentView === 'main') {
      mainMenu.focus();
    } else if (currentView === 'customers') {
      customerList.focus();
    } else if (currentView === 'economy') {
      economyMenu.focus();
    } else if (currentView === 'projects') {
      projectTable.focus();
    } else if (currentView === 'invoices') {
      invoiceTable.focus();
    } else if (currentView === 'accounts') {
      accountsTable.focus();
    } else if (currentView === 'overdue') {
      overdueTable.focus();
    } else if (currentView === 'expenses') {
      expensesTable.focus();
    }
    screen.render();
  });
});

// Help text
const helpText = blessed.text({
  bottom: 0,
  left: 'center',
  width: 'shrink',
  height: 1,
  content: ' ↑↓: Navigér │ Enter: Velg │ ESC: Tilbake │ Ctrl+R: Refresh │ Ctrl+P: Prompt │ Ctrl+C: Avslutt ',
  style: {
    fg: 'black',
    bg: 'white'
  }
});

screen.append(helpText);

// Initial render
screen.render();
