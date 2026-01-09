# Agent Integration Plan - CRM Terminal + Claude Code

## 🎯 Mål

Integrere agent-konseptet fra `digitalspor-agents` inn i `crm-terminal`, men bruke **Claude Code lokalt** i stedet for Anthropic API.

## 🔄 Fra API til Claude Code

### Tidligere oppsett (digitalspor-agents):
- Next.js dashboard + Express agents-server
- Anthropic API for agent-eksekvering
- Supabase database
- Event-driven triggers

### Nytt oppsett (crm-terminal):
- Terminal-basert med Claude Code
- Git som "database"
- Claude Canvas for UI
- Lokal Claude Code-eksekvering
- To brukere med egne Git-kontoer

## 📁 Agent-struktur i CRM Terminal

Foreslått mappestruktur:

```
crm-terminal/
├── agents/                      # Agent-definisjoner (markdown)
│   ├── email-processing/
│   │   ├── email-reader.md
│   │   ├── email-classifier.md
│   │   └── customer-identifier.md
│   ├── task-management/
│   │   ├── task-creator.md
│   │   └── task-prioritizer.md
│   ├── sales/
│   │   ├── quote-generator.md
│   │   └── proposal-writer.md
│   ├── accounting/
│   │   ├── invoice-generator.md
│   │   ├── fiken-syncer.md
│   │   └── time-tracker.md
│   └── communication/
│       ├── email-drafter.md
│       └── status-updater.md
├── data/                        # Data (JSON/markdown)
├── src/                         # Kode (Node.js CLI)
├── cloud.md                     # Claude Code instruksjoner
└── README.md
```

## 🤖 Hvordan Agenter Fungerer med Claude Code

### Konsept

I stedet for å kalle Anthropic API, bruker vi **Claude Code direkte**:

1. **Bruker ber om noe**: "Lag et tilbud for Acme Corp"
2. **Claude Code leser agent-definisjon**: `agents/sales/quote-generator.md`
3. **Claude følger instruksjonene** i agent-filen
4. **Claude bruker tools**: dataManager, fikenClient, gitSync, etc.
5. **Resultat committes og pushes** automatisk

### Agent-definisjon Format

```markdown
# Quote Generator Agent

## Rolle
Du er en agent som genererer profesjonelle tilbud for webprosjekter.

## Input
- Kunde-ID
- Prosjektbeskrivelse
- Ønsket scope

## Prosess
1. Hent kundeinfo fra data/customers/<kunde-id>.json
2. Analyser scope og estimer timer
3. Kalkuler pris basert på timepris (1200 kr/t)
4. Generer tilbuds-dokument
5. Lagre som markdown i data/quotes/<quote-id>.md
6. Commit og push endringer

## Output Format
- Strukturert tilbuds-dokument
- Estimert tid og kostnad
- Leveranse-timeline

## Tools Available
- dataManager (lese/skrive kunde/prosjekt data)
- Calculate functions
- File operations
```

### Claude Code Leser og Følger

Når brukeren sier: **"Lag tilbud for Acme Corp"**

Claude Code vil:
1. Lese `agents/sales/quote-generator.md`
2. Følge prosessen steg-for-steg
3. Bruke tilgjengelige tools
4. Generere output
5. Commit + push

## 📋 Implementeringsplan

### Fase 1: Grunnleggende Agent-struktur

**Oppgaver:**
- [ ] Opprett `/agents/` mappe med kategorier
- [ ] Lag 3-5 grunnleggende agent-definisjoner
- [ ] Oppdater `cloud.md` med instruksjoner om agents

**Prioriterte agenter:**
1. `invoice-generator.md` - Lag fakturaer fra prosjekt-data
2. `fiken-syncer.md` - Sync data til Fiken
3. `email-drafter.md` - Draft e-poster til kunder
4. `quote-generator.md` - Generer tilbud
5. `time-tracker.md` - Logg timer fra beskrivelse

### Fase 2: Data-struktur for Agenter

**Nye datamapper:**
```
data/
├── quotes/            # Tilbuds-dokumenter
├── emails/            # Draft e-poster
├── tasks/             # Oppgaver generert av agenter
└── reports/           # Agent-genererte rapporter
```

### Fase 3: CLI Integration

**Nye kommandoer:**
```bash
npm run crm agent:list              # List tilgjengelige agenter
npm run crm agent:run <agent-name>  # Kjør en agent
npm run crm agent:help <agent-name> # Vis agent-info
```

Men egentlig: **Brukeren spør bare Claude Code direkte!**

Eksempel:
```
User: "Lag et tilbud for Acme Corp basert på prosjektet 'website-redesign'"
Claude: *Leser agents/sales/quote-generator.md*
Claude: *Følger instruksjonene*
Claude: *Genererer tilbud*
Claude: *Committer og pusher*
```

### Fase 4: Agent Workflows (Chains)

Noen oppgaver krever **flere agenter i kjede**:

**Eksempel: Email → Task → Invoice Workflow**

1. Bruker: "Jeg fikk en e-post fra Acme som ber om en faktura"
2. Claude leser `agents/email-processing/email-classifier.md`
3. Claude identifiserer: Dette er en faktura-forespørsel
4. Claude leser `agents/accounting/invoice-generator.md`
5. Claude genererer faktura
6. Claude leser `agents/accounting/fiken-syncer.md`
7. Claude syncer til Fiken
8. Claude leser `agents/communication/email-drafter.md`
9. Claude draftter svar-e-post med fakturalink
10. Alt committes og pushes

**Alt dette skjer naturlig** fordi Claude Code kan:
- Lese agent-definisjoner
- Følge prosesser
- Bruke tools
- Kjede operasjoner

## 🆚 Forskjeller: API vs Claude Code

| Aspekt | digitalspor-agents (API) | crm-terminal (Claude Code) |
|--------|--------------------------|----------------------------|
| **Eksekveringsmetode** | Anthropic API-kall | Claude Code lokalt |
| **Trigger** | Database events (Supabase) | Bruker spør i terminal |
| **Agent-definisjon** | .md filer + TypeScript | .md filer |
| **Data** | PostgreSQL database | Git + JSON/markdown filer |
| **UI** | Next.js dashboard | Terminal + Claude Canvas |
| **Automatisering** | Event-driven | On-demand (bruker-initiert) |
| **Kostnad** | API-kall ($$$) | Lokalt (gratis) |
| **Latency** | API roundtrip | Instant lokal |

## 🎨 Claude Canvas Integration

Bruk Canvas for:
- **Kalender**: Vise deadlines, møter, prosjekt-tidslinjer
- **Dokumenter**: Vise genererte tilbud, fakturaer, rapporter
- **Lister**: Interaktivt velge kunder, prosjekter for agent-operasjoner

**Eksempel:**
```
User: "Vis meg alle aktive prosjekter og la meg velge ett for å generere faktura"
Claude: *Spawner Canvas med prosjekt-liste*
User: *Velger prosjekt i Canvas*
Claude: *Leser agents/accounting/invoice-generator.md*
Claude: *Genererer faktura*
```

## 📝 cloud.md Oppdateringer

Legg til i `cloud.md`:

```markdown
## Agent System

### Hva er Agenter?

Agenter er spesialiserte AI-assistenter definert i `/agents/` mappen.
Hver agent har en markdown-fil som beskriver:
- Rolle og ansvar
- Input og output
- Steg-for-steg prosess
- Tilgjengelige tools

### Når Brukeren Ber om Agent-oppgaver

1. **Les agent-definisjonen** fra relevant .md fil
2. **Følg prosessen** steg-for-steg nøyaktig
3. **Bruk tilgjengelige tools** (dataManager, fikenClient, etc.)
4. **Generer output** i riktig format
5. **Commit og push** alle endringer

### Tilgjengelige Agenter

- `agents/sales/quote-generator.md` - Generer tilbud
- `agents/accounting/invoice-generator.md` - Lag fakturaer
- `agents/accounting/fiken-syncer.md` - Sync til Fiken
- `agents/communication/email-drafter.md` - Draft e-poster
- `agents/task-management/task-creator.md` - Opprett oppgaver

### Agent Workflows

Noen oppgaver krever flere agenter i kjede.
Eksempel: "Lag faktura og send til Fiken"
1. Les invoice-generator.md → lag faktura
2. Les fiken-syncer.md → sync til Fiken
3. Commit + push alt

### Agent Best Practices

- Alltid les agent-definisjonen før du starter
- Følg prosessen nøyaktig
- Bruk tools som spesifisert
- Commit med agent-spesifikk melding:
  `agent:<agent-name>: <beskrivelse>`
  Eksempel: `agent:invoice-generator: Lag faktura #2024-001 for Acme`
```

## 🚀 Quick Start Guide for Agents

### For Claude Code (deg):

Når brukeren ber om noe som matcher en agent:

1. **Identifiser agent**: Hvilken agent passer best?
2. **Les agent-fil**: `Read` relevant .md fil i `/agents/`
3. **Følg instruksjoner**: Gjør nøyaktig det agent-filen sier
4. **Bruk tools**: dataManager, fikenClient, gitSync, etc.
5. **Commit**: Bruk `agent:<navn>: <beskrivelse>` format

### For Brukeren:

Bare spør naturlig:
- "Lag et tilbud for Acme Corp"
- "Generer faktura for prosjekt X"
- "Draft en e-post til kunde Y"
- "Sync alle fakturaer til Fiken"

Claude Code vil automatisk:
- Forstå hvilken agent som trengs
- Lese agent-definisjonen
- Utføre oppgaven
- Committe resultatet

## 🎯 Fordeler med Dette Oppsettet

1. **Lokalt og raskt** - Ingen API-latency
2. **Ingen kostnader** - Claude Code er lokalt
3. **Git-basert** - Full historikk og versjonskontroll
4. **Fleksibelt** - Lett å legge til nye agenter
5. **Transparent** - Brukeren ser alt som skjer
6. **Samarbeid** - To brukere kan jobbe samtidig
7. **Backup** - GitHub er automatisk backup

## 📊 Neste Steg

1. Opprett agent-strukturen i crm-terminal
2. Lag 3-5 grunnleggende agent-definisjoner
3. Test med en enkel agent (f.eks. invoice-generator)
4. Iterer og forbedre basert på erfaring
5. Legg til flere agenter etter behov

## 💡 Eksempel: Invoice Generator Agent

Se neste fil for komplett eksempel på hvordan en agent-definisjon ser ut.
