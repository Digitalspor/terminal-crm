# CRM Terminal - AI-Powered CRM for Digitale Byråer

Et intelligent, Git-basert CRM-system for terminalen med AI-agenter, Claude Canvas dashboard og automatisk synkronisering.

## 🎯 Konsept

Dette er et **terminal-basert CRM-system** designet for to brukere som jobber sammen via Git. I stedet for en database, bruker vi Git som "source of truth" og Claude Code som AI-assistent.

### Nøkkelfunksjoner

- ✅ **Terminal-basert** - Alt i terminalen med Claude Code
- ✅ **Claude Canvas** - Visuelt, interaktivt dashboard
- ✅ **Git-synkronisering** - Automatisk commit/push av alle endringer
- ✅ **AI-agenter** - Spesialiserte assistenter for ulike oppgaver
- ✅ **Kunde-memory** - AI lærer fra hver interaksjon
- ✅ **Fiken-integrasjon** - Automatisk regnskapsføring
- ✅ **Gmail-integrasjon** - E-post håndtering
- ✅ **To brukere** - Sømløst samarbeid via Git

## 🚀 Quick Start

### Installasjon

```bash
# Klon repoet
git clone <repo-url>
cd crm-terminal

# Installer dependencies
npm install

# Konfigurer .env
cp .env.example .env
# Rediger .env med Fiken API tokens

# Kjør CRM
npm run crm
```

### Daglig Workflow

```bash
# 1. Start dagen med pull
git pull --rebase

# 2. Åpne Claude Code og jobb
# Si: "Vis meg dagens oversikt"
# Si: "Legg til ny kunde"
# Si: "Lag faktura for Acme"

# 3. Alt committes og pushes automatisk

# 4. Kollegaen får dine endringer
# (De kjører også git pull)
```

## 📁 Prosjektstruktur

```
crm-terminal/
├── agents/                      # AI agent-definisjoner
│   ├── sales/                   # Salg og tilbud
│   ├── accounting/              # Fakturering og regnskap
│   ├── communication/           # E-post og kommunikasjon
│   └── task-management/         # Oppgavehåndtering
│
├── data/                        # All data (JSON/Markdown)
│   ├── customers/               # Kundedata
│   ├── invoices/                # Fakturaer
│   ├── projects/                # Prosjekter
│   ├── memory/                  # AI kunde-memory (delt)
│   ├── context/                 # AI kunde-context (delt)
│   ├── notes/                   # Bruker-spesifikke notater
│   ├── reminders/               # Bruker-spesifikke påminnelser
│   ├── calendar/                # Bruker-spesifikke kalender
│   ├── quotes/                  # Tilbud
│   ├── emails/                  # E-post drafts
│   └── tasks/                   # Oppgaver
│
├── logs/                        # Tidslogger (per dag)
├── credentials/                 # API credentials (gitignored)
├── src/                         # Applikasjonskode
│   ├── index.js                 # Main CLI
│   ├── data-manager.js          # Data CRUD
│   ├── git-sync.js              # Git auto-commit/push
│   ├── fiken-client.js          # Fiken API
│   ├── fiken-sync.js            # Fiken synkronisering
│   ├── gmail-client.js          # Gmail API
│   ├── notes-manager.js         # Notater/påminnelser/kalender
│   └── user-context.js          # Bruker-identifikasjon
│
├── cloud.md                     # Claude Code instruksjoner (VIKTIG!)
├── README.md                    # Dette dokumentet
├── WORKFLOW.md                  # Detaljert Git-workflow
├── AGENT_INTEGRATION_PLAN.md   # Agent-system plan
├── CANVAS_DASHBOARD_PLAN.md    # Dashboard plan
└── CUSTOMER_MEMORY_SYSTEM.md   # Memory/context system
```

## 🤖 AI Agent System

Agenter er spesialiserte AI-assistenter definert i `/agents/` som markdown-filer.

### Hvordan det fungerer

```
User: "Lag et tilbud for Acme Corp"
  ↓
Claude Code leser: agents/sales/quote-generator.md
  ↓
Claude følger agent-instruksjonene
  ↓
Claude genererer tilbud
  ↓
Claude committer og pusher
  ↓
Kollegaen får tilbudet ved git pull
```

### Tilgjengelige Agenter (planlagt)

- **Sales**: quote-generator, proposal-writer
- **Accounting**: invoice-generator, fiken-syncer
- **Communication**: email-drafter, status-updater
- **Task Management**: task-creator, task-prioritizer

Se `AGENT_INTEGRATION_PLAN.md` for detaljer.

## 🎨 Claude Canvas Dashboard

Visuelt, interaktivt dashboard i terminalen.

**Bruk:**
```
User: "Vis meg en oversikt"
→ Claude spawner Canvas med dashboard

User: *Velger kunde i Canvas*
→ Claude viser kunde-detaljer

User: "Lag faktura"
→ Claude genererer faktura fra Canvas-valg
```

Se `CANVAS_DASHBOARD_PLAN.md` for detaljer.

## 🧠 Kunde Memory & Context

AI lærer fra hver interaksjon og lagrer kunnskap i Git.

**Memory** (`data/memory/<kunde-id>-memory.json`):
- Strukturert data om kunden
- Interaksjonshistorikk
- Preferanser og business context
- Relationship metrics

**Context** (`data/context/<kunde-id>-context.md`):
- Naturlig språk insights
- Kommunikasjonsstil
- Key learnings
- Fremtidige muligheter

**Resultat**: Bedre, mer personalisert kommunikasjon!

Se `CUSTOMER_MEMORY_SYSTEM.md` for detaljer.

## 💰 Fiken-integrasjon

Automatisk regnskapsføring via Fiken API.

### Funksjonalitet

- Hente kunder fra Fiken
- Synce fakturaer
- Pushe fakturaer til Fiken
- Hente økonomisk data

### Guardrails

**VIKTIG**: Fiken sender EKTE fakturaer!

- ✅ Bekreftelse før sending
- ✅ Kun draft-fakturaer kan sendes
- ✅ Ingen duplikater
- ✅ Full logging
- ✅ Dobbeltsjekk før sending

Se `cloud.md` for detaljer om Fiken guardrails.

## 📧 Gmail-integrasjon

Håndter felles Gmail-konto for byrået.

```bash
# Autentiser
npm run crm gmail:auth

# Vis e-poster fra kunde
npm run crm gmail:customer <kunde-id>
```

## 📊 CLI Kommandoer

```bash
# Data
npm run crm kunder            # List kunder
npm run crm fakturaer         # List fakturaer
npm run crm prosjekter        # List prosjekter
npm run crm logg              # Vis dagens logg

# Personlig
npm run crm påminnelser       # Dine påminnelser
npm run crm kalender          # Din kalender
npm run crm note:mine <id>    # Dine notater
npm run crm whoami            # Vis din Git-bruker

# Fiken
npm run crm fiken:sync-customers    # Sync kunder
npm run crm fiken:push-invoice <id> # Push faktura
npm run crm fiken:accounts          # Vis kontoer

# Gmail
npm run crm gmail:auth              # Autentiser
npm run crm gmail:customer <id>     # E-poster med kunde

# Git
npm run crm sync              # Pull og push
npm run crm status            # Git status
```

## 🤝 To-Bruker Samarbeid

### Bruker-spesifikk Data

Hver bruker har egne:
- Notater: `data/notes/<kunde>/<user>.md`
- Påminnelser: `data/reminders/<user>-reminders.json`
- Kalender: `data/calendar/<user>-calendar.json`

### Delt Data

Delt mellom brukere:
- Kunder: `data/customers/`
- Fakturaer: `data/invoices/`
- Prosjekter: `data/projects/`
- **Memory**: `data/memory/` (AI lærer for begge!)
- **Context**: `data/context/` (AI deler kunnskap!)

### Konflikt-håndtering

Git-konflikter er sjeldne fordi:
- Bruker-spesifikk data = ingen konflikt
- Ulike kunder = ingen konflikt
- Kommuniser ved samme kunde

Se `WORKFLOW.md` for konfliktløsning.

## 🔐 Sikkerhet

- **Private GitHub repo** - Kun dere to har tilgang
- **API credentials** - Lagres i `.env` (gitignored)
- **Gmail tokens** - Lagres i `credentials/` (gitignored)
- **Fiken tokens** - Lagres i `.env` (gitignored)

## 📚 Dokumentasjon

- **`cloud.md`** ⭐ - Instruksjoner for Claude Code (VIKTIG!)
- **`WORKFLOW.md`** - Detaljert Git-workflow guide
- **`AGENT_INTEGRATION_PLAN.md`** - Agent-system arkitektur
- **`CANVAS_DASHBOARD_PLAN.md`** - Dashboard design og bruk
- **`CUSTOMER_MEMORY_SYSTEM.md`** - Memory/context system

## 🚀 Neste Steg

1. ✅ **Grunnleggende struktur** - Ferdig!
2. ⏳ **Installer dependencies** - Kjør `npm install`
3. ⏳ **Konfigurer .env** - Legg til Fiken API tokens
4. ⏳ **Test CLI** - Kjør `npm run crm`
5. ⏳ **Lag første kunde** - Be Claude om hjelp
6. ⏳ **Implementer agenter** - Lag først invoice-generator
7. ⏳ **Test Canvas** - Be Claude vise dashboard
8. ⏳ **Sync med Fiken** - Test kunde-sync

## 💡 Brukseksempler

### Eksempel 1: Ny Kunde

```
User: "Jeg har en ny kunde - Acme Corporation"

Claude: "La meg hjelpe deg å legge til Acme Corporation.
         Hva er kontaktpersonens navn og e-post?"

User: "John Doe, john@acme.com"

Claude: *Oppretter data/customers/acme-corporation.json*
        *Oppretter data/memory/acme-corporation-memory.json*
        *Oppretter data/context/acme-corporation-context.md*
        *Committer og pusher*

        "✓ Acme Corporation lagt til!"
```

### Eksempel 2: Lag Faktura

```
User: "Lag faktura for Acme basert på prosjektet 'website-redesign'"

Claude: *Leser agents/accounting/invoice-generator.md*
        *Følger agent-instruksjoner*
        *Henter prosjekt-data*
        *Kalkulerer timer og pris*
        *Genererer faktura #2024-001*
        *Committer og pusher*

        "✓ Faktura #2024-001 opprettet (72.000 kr)"
        "Vil du sende den til Fiken?"

User: "Ja"

Claude: *Dobbeltsjekker*
        *Viser sammendrag*
        *Ber om bekreftelse*

        "⚠️  Dette sender EKTE faktura til Fiken. Bekreft?"

User: "Ja, send"

Claude: *Sender til Fiken*
        *Oppdaterer lokal faktura*
        *Logger sending*
        *Committer og pusher*

        "✓ Sendt til Fiken (ID: fiken-123)"
```

### Eksempel 3: Dashboard

```
User: "Vis meg en oversikt"

Claude: *Spawner Canvas med dashboard*

[Dashboard vises i terminal med alle kunder, prosjekter, fakturaer]

User: *Velger "Acme Corporation" i Canvas*

Claude: *Oppdaterer Canvas til kunde-detaljer*
        *Viser prosjekter, fakturaer, notater, memory*

User: "Send en statusoppdatering til denne kunden"

Claude: *Leser agents/communication/email-drafter.md*
        *Leser kunde memory og context*
        *Draftter personalisert e-post*
        *Viser draft i Canvas*

        "E-post draft klar. Vil du sende?"
```

## 🎯 Fordeler med Dette Oppsettet

1. **Lokalt og raskt** - Ingen API-latency
2. **Ingen kostnader** - Claude Code er lokalt
3. **Git-basert** - Full historikk og versjonskontroll
4. **AI-powered** - Agenter automatiserer repetitive oppgaver
5. **Lærende system** - Memory forbedrer kommunikasjon over tid
6. **Visuelt** - Canvas gjør det interaktivt og enkelt
7. **Samarbeid** - To brukere jobber sømløst sammen
8. **Backup** - GitHub er automatisk backup
9. **Fleksibelt** - Lett å legge til nye features
10. **Transparent** - Alt er synlig og reverserbart

## 📞 Support

Hvis noe går galt:
1. Les feilmeldingen nøyaktig
2. Sjekk `git status`
3. Spør Claude Code om hjelp
4. Se dokumentasjonen
5. Spør kollegaen

**Husk**: Git er veldig vanskelig å ødelegge permanent!

---

**Bygget med Claude Code for sømløst samarbeid mellom to digitale byrå-kolleger** 🚀
