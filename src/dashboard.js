#!/usr/bin/env node
import { dataManager } from './data-manager.js';
import { notesManager } from './notes-manager.js';
import { userContext } from './user-context.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateDashboard() {
  // Hent all data
  const customers = await dataManager.listCustomers();
  const invoices = await dataManager.listInvoices();
  const projects = await dataManager.listProjects();
  const user = await userContext.getCurrentGitUser();
  const reminders = await notesManager.getReminders();
  const upcomingEvents = await notesManager.getUpcomingEvents(7);

  const today = new Date().toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Kalkuler statistics
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const draftInvoices = invoices.filter(i => i.status === 'draft').length;
  const sentInvoices = invoices.filter(i => i.status === 'sent').length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;

  const activeReminders = reminders.filter(r => !r.completed).length;

  // Generer markdown
  let markdown = `# 🎯 CRM Dashboard

**Terminal CRM** • ${today}
**Bruker:** ${user.name} (${user.email})

---

## 📊 Oversikt

| Kategori | Status | Tall |
|----------|--------|------|
| 👥 **Kunder** | ${customers.length > 0 ? '🟢' : '🔴'} | ${customers.length} totalt |
| 🚀 **Prosjekter** | ${activeProjects > 0 ? '🟢' : '🟡'} | ${activeProjects} aktive, ${completedProjects} fullført |
| 💰 **Økonomi** | ${totalOutstanding > 0 ? '🟡' : '🟢'} | ${totalOutstanding.toLocaleString('nb-NO')} kr utestående |
| 📧 **Fakturaer** | ${draftInvoices > 0 ? '🟡' : '🟢'} | ${draftInvoices} draft, ${sentInvoices} sendt, ${paidInvoices} betalt |
| ⏰ **Påminnelser** | ${activeReminders > 0 ? '🟡' : '🟢'} | ${activeReminders} aktive |
| 📅 **Kalender** | ${upcomingEvents.length > 0 ? '🟡' : '🟢'} | ${upcomingEvents.length} hendelser neste 7 dager |

---

## 👥 Kunder (${customers.length})

`;

  customers.forEach(customer => {
    const customerProjects = projects.filter(p => p.customerId === customer.id);
    const customerInvoices = invoices.filter(i => i.customerId === customer.id);
    const customerOutstanding = customerInvoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + i.total, 0);

    markdown += `### ${customer.name}
- **ID:** \`${customer.id}\`
- **Kontakt:** ${customer.contact.name} (${customer.contact.email})
- **Telefon:** ${customer.contact.phone}
${customer.orgNr ? `- **Org.nr:** ${customer.orgNr}` : ''}
${customer.address ? `- **Adresse:** ${customer.address.street}, ${customer.address.postalCode} ${customer.address.city}` : ''}
- **Prosjekter:** ${customerProjects.length} (${customerProjects.filter(p => p.status === 'in-progress').length} aktive)
- **Utestående:** ${customerOutstanding.toLocaleString('nb-NO')} kr
${customer.notes ? `- **Notater:** ${customer.notes}` : ''}
- **Opprettet:** ${new Date(customer.created).toLocaleDateString('nb-NO')}

`;
  });

  if (customers.length === 0) {
    markdown += `*Ingen kunder ennå. Si: "Legg til ny kunde"*\n\n`;
  }

  markdown += `---

## 🚀 Prosjekter (${projects.length})

`;

  projects.forEach(project => {
    const customer = customers.find(c => c.id === project.customerId);
    const progress = project.estimatedHours > 0
      ? Math.round((project.spentHours / project.estimatedHours) * 100)
      : 0;

    const statusEmoji = project.status === 'completed' ? '✅' :
                       project.status === 'in-progress' ? '🔵' :
                       project.status === 'planning' ? '📋' : '⏸️';

    markdown += `### ${statusEmoji} ${project.name}
- **ID:** \`${project.id}\`
- **Kunde:** ${customer ? customer.name : project.customerId}
- **Status:** ${project.status}
- **Progress:** ${progress}% (${project.spentHours}/${project.estimatedHours} timer)
- **Budsjett:** ${project.budget.toLocaleString('nb-NO')} kr (@ ${project.hourlyRate} kr/t)
${project.startDate ? `- **Start:** ${project.startDate}` : ''}
${project.deadline ? `- **Deadline:** ${project.deadline}` : ''}
${project.team ? `- **Team:** ${project.team.join(', ')}` : ''}
${project.tags ? `- **Tags:** ${project.tags.join(', ')}` : ''}
- **Beskrivelse:** ${project.description}
${project.notes ? `- **Notater:** ${project.notes}` : ''}

`;
  });

  if (projects.length === 0) {
    markdown += `*Ingen prosjekter ennå. Si: "Opprett nytt prosjekt"*\n\n`;
  }

  markdown += `---

## 💰 Fakturaer (${invoices.length})

`;

  invoices.forEach(invoice => {
    const customer = customers.find(c => c.id === invoice.customerId);
    const statusEmoji = invoice.status === 'paid' ? '✅' :
                       invoice.status === 'sent' ? '📧' :
                       invoice.status === 'draft' ? '📝' : '❓';

    const overdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';

    markdown += `### ${statusEmoji} Faktura #${invoice.invoiceNumber}
- **Kunde:** ${customer ? customer.name : invoice.customerId}
- **Status:** ${invoice.status}${overdue ? ' 🔴 FORFALT!' : ''}
- **Dato:** ${invoice.date}
- **Forfallsdato:** ${invoice.dueDate}
- **Beløp:** ${invoice.total.toLocaleString('nb-NO')} kr (inkl. MVA)

**Linjer:**
`;

    invoice.items.forEach((item, idx) => {
      markdown += `${idx + 1}. ${item.description} - ${item.hours}t @ ${item.rate} kr = ${item.amount.toLocaleString('nb-NO')} kr\n`;
    });

    markdown += `
**Subtotal:** ${invoice.subtotal.toLocaleString('nb-NO')} kr
**MVA (25%):** ${invoice.vat.toLocaleString('nb-NO')} kr
**Total:** ${invoice.total.toLocaleString('nb-NO')} kr

${invoice.fikenSynced ? '✅ Synket til Fiken' : '⏳ Ikke synket til Fiken'}
${invoice.notes ? `\n**Notater:** ${invoice.notes}` : ''}

`;
  });

  if (invoices.length === 0) {
    markdown += `*Ingen fakturaer ennå. Si: "Lag faktura for <kunde>"*\n\n`;
  }

  markdown += `---

## ⏰ Påminnelser (${reminders.length})

`;

  const activeRemindersFiltered = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  if (activeRemindersFiltered.length > 0) {
    markdown += `### Aktive (${activeRemindersFiltered.length})

`;
    activeRemindersFiltered.forEach(reminder => {
      const overdue = reminder.dueDate && new Date(reminder.dueDate) < new Date();
      markdown += `- ${overdue ? '🔴' : '🟡'} **${reminder.text}**\n`;
      if (reminder.dueDate) {
        markdown += `  - Forfaller: ${reminder.dueDate}\n`;
      }
      if (reminder.customerId) {
        markdown += `  - Kunde: ${reminder.customerId}\n`;
      }
      markdown += `\n`;
    });
  }

  if (completedReminders.length > 0) {
    markdown += `### Fullførte (${completedReminders.length})

`;
    completedReminders.slice(0, 5).forEach(reminder => {
      markdown += `- ✅ ~~${reminder.text}~~\n`;
    });
    markdown += `\n`;
  }

  if (reminders.length === 0) {
    markdown += `*Ingen påminnelser. Si: "Legg til påminnelse"*\n\n`;
  }

  markdown += `---

## 📅 Kommende Hendelser (7 dager)

`;

  if (upcomingEvents.length > 0) {
    upcomingEvents.forEach(event => {
      const date = new Date(event.date).toLocaleDateString('nb-NO');
      const time = event.time || '';
      markdown += `### ${date}${time ? ` kl. ${time}` : ''}
- **${event.title}**
${event.description ? `  - ${event.description}` : ''}
${event.customerId ? `  - Kunde: ${event.customerId}` : ''}
${event.type ? `  - Type: ${event.type}` : ''}

`;
    });
  } else {
    markdown += `*Ingen hendelser neste 7 dager. Si: "Legg til kalender-hendelse"*\n\n`;
  }

  markdown += `---

## ⚡ Neste Steg

`;

  // Smart suggestions basert på state
  if (draftInvoices > 0) {
    markdown += `1. 📧 **Send draft fakturaer** - ${draftInvoices} faktura(er) venter på sending\n`;
  }

  if (activeProjects > 0) {
    markdown += `1. ⏱️ **Logg timer** - ${activeProjects} aktive prosjekt(er) trenger tidsføring\n`;
  }

  if (customers.length === 0) {
    markdown += `1. 👥 **Legg til kunder** - Start med å legge til din første kunde\n`;
  }

  if (!process.env.FIKEN_API_TOKEN) {
    markdown += `1. 🔧 **Konfigurer Fiken API** - Legg til API nøkkel i .env\n`;
  }

  if (activeRemindersFiltered.length > 0) {
    markdown += `1. ⏰ **Sjekk påminnelser** - ${activeRemindersFiltered.length} påminnelse(r) venter\n`;
  }

  markdown += `
---

## 💡 Hurtigkommandoer

\`\`\`bash
# Vis data
npm run crm kunder              # List alle kunder
npm run crm prosjekter          # List alle prosjekter
npm run crm fakturaer           # List alle fakturaer
npm run crm påminnelser         # Dine påminnelser
npm run crm kalender            # Kommende hendelser

# Personlig
npm run crm note:mine <id>      # Dine notater på kunde
npm run crm whoami              # Vis din Git-bruker

# Fiken (krever API nøkkel)
npm run crm fiken:sync-customers    # Hent kunder fra Fiken
npm run crm fiken:push-invoice <id> # Send faktura til Fiken

# Git
npm run crm sync                # Pull og push endringer
npm run crm status              # Git status
\`\`\`

---

## 🤖 Claude Code Kommandoer

**Snakk naturlig med Claude Code:**

- "Vis meg en oversikt" → Dashboard
- "Legg til ny kunde" → Guider deg gjennom
- "Lag faktura for Acme" → Agent genererer faktura
- "Logg 3 timer på prosjekt X" → Tidsføring
- "Send e-post til kunde Y" → Draft e-post
- "Hva er status på alle prosjekter?" → Rapport

---

**Sist oppdatert:** ${new Date().toLocaleString('nb-NO')}
**System:** ${process.platform} • Node ${process.version}
**Status:** 🟢 Fungerer${!process.env.FIKEN_API_TOKEN ? ' | 🔴 Fiken ikke konfigurert' : ' | 🟢 Fiken OK'}
`;

  return markdown;
}

async function showDashboard() {
  try {
    const markdown = await generateDashboard();

    // Lagre markdown til temp fil
    const fs = await import('fs/promises');
    const os = await import('os');
    const path = await import('path');

    const tempFile = path.join(os.tmpdir(), `crm-dashboard-${Date.now()}.md`);
    await fs.writeFile(tempFile, markdown, 'utf-8');

    // Kjør Canvas document med fil-ref
    const canvasPath = '/Users/andrecollier/.claude/plugins/cache/claude-canvas/canvas/0.1.0';

    const config = {
      content: markdown,
      title: 'CRM Dashboard'
    };

    // Escape JSON for bash
    const configJson = JSON.stringify(JSON.stringify(config));

    await execAsync(
      `cd ${canvasPath} && bun run src/cli.ts show document --scenario display --config ${configJson}`,
      { shell: '/bin/bash', maxBuffer: 1024 * 1024 * 10 }
    );

    // Cleanup
    await fs.unlink(tempFile).catch(() => {});

  } catch (error) {
    console.error('Feil ved visning av dashboard:', error.message);
    process.exit(1);
  }
}

// Kjør hvis dette er main module
if (import.meta.url === `file://${process.argv[1]}`) {
  showDashboard();
}

export { generateDashboard, showDashboard };
