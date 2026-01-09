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
    .reduce((sum, i) => sum + i.total, 0);

  // Dummy data for notifications and goal
  const notifications = 3; // Dummy: 3 new messages
  const monthlyGoal = 200000;
  const goalProgress = Math.round((monthRevenue / monthlyGoal) * 100);
  const goalBar = `${'▓'.repeat(Math.round(goalProgress/10))}${'░'.repeat(10-Math.round(goalProgress/10))}`;

  const content = ` 🕐 ${time} │ 📅 ${date} │ 💰 ${monthRevenue.toLocaleString('nb-NO')} kr │ 🎯 ${goalBar} ${goalProgress}% (${monthlyGoal.toLocaleString('nb-NO')} kr) │ 📬 ${notifications} nye`;

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

// Update stats
function updateStats() {
  const customers = getCustomers();
  const projects = getProjects();
  const invoices = getInvoices();
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const draftInvoices = invoices.filter(i => i.status === 'draft');
  const outstanding = draftInvoices.reduce((sum, i) => sum + i.total, 0);

  const content = `{center}{bold}{cyan-fg}📊 QUICK STATS{/cyan-fg}{/bold}{/center}
{center}👥 {bold}${customers.length}{/bold} kunder  │  📁 {bold}${activeProjects}{/bold} aktive prosjekter  │  💰 {bold}${outstanding.toLocaleString('nb-NO')} kr{/bold} utestående{/center}`;

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
  items: [
    '{center}👥  KUNDER{/center}',
    '{center}💰  ØKONOMI{/center}',
    '{center}🧾  FAKTURA{/center}',
    '{center}📁  PROSJEKTER{/center}',
    '{center}📊  OVERSIKT{/center}',
    '{center}📝  NOTATER{/center}',
    '{center}📅  KALENDER{/center}',
    '{center}🧪  TEST-KATEGORI{/center}',
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
screen.append(projectTable);
screen.append(invoiceTable);
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

// Main menu selection
mainMenu.on('select', (item, index) => {
  const text = item.getText().trim();

  if (text.includes('Avslutt')) {
    return process.exit(0);
  }

  if (text.includes('Kunder')) {
    showCustomers();
  } else if (text.includes('Økonomi')) {
    showInvoices();
  } else if (text.includes('Faktura')) {
    showInvoices();
  } else if (text.includes('Prosjekter')) {
    showProjects();
  } else if (text.includes('Oversikt')) {
    showOverview();
  } else if (text.includes('Notater')) {
    showMessage('📝 Notater', 'Notater-funksjonen kommer snart!');
  } else if (text.includes('Kalender')) {
    showMessage('📅 Kalender', 'Kalender-funksjonen kommer snart!');
  }
});

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

  content += `  {bold}{yellow-fg}┌─ FAKTURAER ({${invoices.length}}){/yellow-fg}{/bold}\n`;
  if (invoices.length === 0) {
    content += `  │ {gray-fg}Ingen fakturaer enda{/gray-fg}\n`;
  } else {
    invoices.forEach(inv => {
      const statusIcon = inv.status === 'draft' ? '📝' : inv.status === 'sent' ? '📤' : '✅';
      const statusColor = inv.status === 'draft' ? 'white' : inv.status === 'sent' ? 'yellow' : 'green';
      content += `  │ ${statusIcon} {bold}${inv.invoiceNumber}{/bold} - {${statusColor}-fg}${inv.total.toLocaleString('nb-NO')} kr{/${statusColor}-fg}\n`;
      content += `  │    Forfaller: ${inv.dueDate}\n`;
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
    data.push([
      inv.invoiceNumber,
      customer?.name || inv.customerId,
      `${inv.total.toLocaleString('nb-NO')} kr`,
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
  statsBox.show();
  mainMenu.show();
  mainMenu.focus();
  currentView = 'main';
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
screen.key(['C-r'], () => {
  if (currentView === 'main') {
    updateStats();
    updateStatusBar();
  } else if (currentView === 'customers') {
    showCustomers();
  } else if (currentView === 'projects') {
    showProjects();
  } else if (currentView === 'invoices') {
    showInvoices();
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
    } else if (currentView === 'projects') {
      projectTable.focus();
    } else if (currentView === 'invoices') {
      invoiceTable.focus();
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
