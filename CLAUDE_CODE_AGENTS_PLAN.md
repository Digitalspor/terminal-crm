# Claude Code Agents Plan - Lokale Sub-Agents med Delt Læring

## 🎯 Konsept

Kombinere agent-systemet fra digitalspor-agents med **Claude Code's lokale sub-agents**, hvor:
- ✅ **Agent-definisjoner** ligger i `/agents/` (markdown)
- ✅ **Claude Code Task tool** kjører agentene lokalt
- ✅ **Memory og læring** deles via Git
- ✅ **To brukere** har separate Claude Code instanser som lærer sammen

## 🆚 Forskjell: Før vs Nå

| Aspekt | digitalspor-agents (Før) | crm-terminal (Nå) |
|--------|--------------------------|-------------------|
| **Eksekveringsmetode** | Anthropic API (remote) | Claude Code sub-agents (lokalt) |
| **Kostnad** | $$ per API-kall | Gratis |
| **Trigger** | Database events (auto) | On-demand (bruker ber) |
| **Agent format** | .md filer + TypeScript | .md filer (ren markdown) |
| **Læring** | Database → ikke delt | Git → delt mellom brukere! |
| **Speed** | API roundtrip latency | Instant lokal |
| **Collaboration** | En instans, felles data | To instanser, Git-sync |

## 🤖 Claude Code Sub-Agents

Claude Code har innebygde sub-agents via Task tool:

### 1. **general-purpose** - For komplekse oppgaver
```typescript
Task: "Lag en faktura for Acme Corp basert på prosjekt X"
Agent: general-purpose
Prompt: "Les agents/accounting/invoice-generator.md og følg instruksjonene"
```

### 2. **Explore** - For codebase/data utforskning
```typescript
Task: "Finn alle kunder som har fakturaer forfalt i mer enn 30 dager"
Agent: Explore
Thoroughness: medium
```

### 3. **Bash** - For git operasjoner
```typescript
Task: "Sync alle endringer til GitHub"
Agent: Bash
Command: git pull && git add . && git commit && git push
```

## 📁 Agent Struktur

```
agents/
├── sales/
│   ├── quote-generator.md          ← Agent definisjon
│   ├── quote-generator-context.md  ← Læring/tips fra tidligere quotes
│   └── quote-generator-memory.json ← Metrics/patterns
│
├── accounting/
│   ├── invoice-generator.md
│   ├── invoice-generator-context.md
│   └── invoice-generator-memory.json
│
├── communication/
│   ├── email-drafter.md
│   ├── email-drafter-context.md
│   └── email-drafter-memory.json
│
└── task-management/
    ├── task-creator.md
    ├── task-creator-context.md
    └── task-creator-memory.json
```

## 🧠 Hvordan Læring Fungerer

### Scenario: Du bruker invoice-generator

```
1. DU (Andre):
   "Lag faktura for Acme"

2. Claude Code (din instans):
   - Leser: agents/accounting/invoice-generator.md
   - Leser: agents/accounting/invoice-generator-context.md (læring)
   - Leser: data/memory/acme-corp-memory.json (kunde-kontekst)
   - Følger prosess i agent-definisjonen
   - Genererer faktura

3. Claude Code oppdaterer:
   - agents/accounting/invoice-generator-context.md
     "Tip: Acme foretrekker detaljert linjeføring"
   - agents/accounting/invoice-generator-memory.json
     {"totalInvoicesGenerated": 24, "avgAmount": 65000}
   - data/memory/acme-corp-memory.json
     Ny interaksjon, preferanser

4. Git commit og push

5. KOLLEGA (din kollega):
   - Kjører: git pull
   - Får ALLE oppdateringer:
     * Din læring i invoice-generator-context.md
     * Metrics i invoice-generator-memory.json
     * Kunde-memory for Acme

6. Kollega bruker samme agent:
   "Lag faktura for Beta AS"

7. Claude Code (kollegaens instans):
   - Leser SAMME invoice-generator.md
   - Leser DIN læring i invoice-generator-context.md
   - Bruker læringen fra Acme-fakturaen
   - Genererer bedre faktura for Beta AS!
```

**Resultat:** Begge lærer fra hverandre via Git!

## 🏗️ Agent Definisjon Format

`agents/accounting/invoice-generator.md`:

```markdown
# Invoice Generator Agent

## Rolle
Du er en spesialisert agent for å generere profesjonelle fakturaer.

## Pre-requisites (Les før du starter)
1. Les: agents/accounting/invoice-generator-context.md (læring fra tidligere)
2. Les: data/memory/<customer-id>-memory.json (kunde-kontekst)
3. Les: data/projects/<project-id>.json (prosjekt-data)

## Input
- Kunde-ID (required)
- Prosjekt-ID (required)
- Ekstra linjer (optional)

## Prosess

### Steg 1: Valider input
- Sjekk at kunde finnes
- Sjekk at prosjekt finnes
- Sjekk at prosjekt har timer logget

### Steg 2: Hent kontekst
- Les kunde memory for preferanser
- Les invoice-generator-context.md for tips
- Sjekk tidligere fakturaer til denne kunden

### Steg 3: Kalkuler beløp
- Hent timer fra prosjekt (spentHours)
- Hent timepris (hourlyRate)
- Kalkuler subtotal = timer * pris
- Kalkuler MVA = subtotal * 0.25
- Kalkuler total = subtotal + MVA

### Steg 4: Generer fakturanummer
- Bruk dataManager.getNextInvoiceNumber()
- Format: YYYY-NNN (f.eks. 2026-001)

### Steg 5: Opprett faktura
```javascript
const invoice = {
  id: invoiceNumber,
  customerId: customerId,
  invoiceNumber: invoiceNumber,
  date: new Date().toISOString().split('T')[0],
  dueDate: calculateDueDate(30), // 30 dager frem
  status: 'draft',
  items: [
    {
      description: `${project.name} - ${project.description}`,
      hours: project.spentHours,
      rate: project.hourlyRate,
      amount: project.spentHours * project.hourlyRate
    }
  ],
  subtotal: subtotal,
  vat: vat,
  total: total,
  fikenId: null,
  fikenSynced: false,
  notes: getCustomerSpecificNotes(customerMemory),
  created: new Date().toISOString(),
  updated: new Date().toISOString()
}
```

### Steg 6: Lagre faktura
- Bruk: dataManager.saveInvoice(invoice)
- Fil: data/invoices/<invoice-id>.json

### Steg 7: Oppdater læring
- Oppdater: agents/accounting/invoice-generator-context.md
  ```markdown
  ## Læring fra faktura #<invoice-number>
  - Kunde: <kunde-navn>
  - Beløp: <total>
  - Insight: <hva lærte vi?>
  ```

- Oppdater: agents/accounting/invoice-generator-memory.json
  ```json
  {
    "totalInvoicesGenerated": 25,
    "avgAmount": 66000,
    "lastGenerated": "2026-01-09T16:30:00Z",
    "byUser": {
      "andre": 15,
      "kollega": 10
    }
  }
  ```

- Oppdater: data/memory/<customer-id>-memory.json
  ```json
  {
    "interactions": [
      {
        "date": "2026-01-09T16:30:00Z",
        "type": "invoice-generated",
        "summary": "Faktura #2026-001 opprettet for 72.000 kr",
        "by": "andre"
      }
    ]
  }
  ```

### Steg 8: Git commit og push
- Commit message: `agent:invoice-generator: Lag faktura #<invoice-number> for <kunde>`
- Bruk gitSync.commitAndPush()

### Steg 9: Output til bruker
```
✓ Faktura #2026-001 opprettet!

Kunde: Acme Corporation
Beløp: 72.000 kr (inkl. 25% MVA)
Status: Draft
Forfallsdato: 8. februar 2026

Filer opprettet:
- data/invoices/2026-001.json
- Oppdatert: customer memory, agent context

Neste steg:
1. Review faktura: npm run crm invoice:show 2026-001
2. Send til Fiken: npm run crm fiken:push-invoice 2026-001
```

## Post-execution Learning

Agent skal alltid:
1. Dokumentere hva som fungerte
2. Dokumentere hva som kan forbedres
3. Lagre patterns for fremtidig bruk
4. Oppdatere metrics

## Tools Available

Fra Claude Code:
- dataManager (CRUD operasjoner)
- gitSync (Git operasjoner)
- fikenClient (Fiken API)
- gmailClient (Gmail API)
- notesManager (Notater/påminnelser)
- userContext (Bruker-info)

Fra Node.js:
- fs (File operations)
- Date manipulation
- JSON parsing
- String formatting

## Error Handling

Hvis noe feiler:
1. Logg feilen i agent-context.md
2. Informer brukeren klart
3. Reverter delvis endringer hvis mulig
4. Ikke commit hvis kritisk feil

## Success Criteria

✓ Faktura opprettet i data/invoices/
✓ Kunde memory oppdatert
✓ Agent context/memory oppdatert
✓ Alt committet og pushet til Git
✓ Bruker informert om resultat
```

## 🔄 Workflow: Bruker → Agent → Læring → Git

### 1. Bruker ber om noe

```
User: "Lag en faktura for Acme basert på prosjektet 'website-redesign'"
```

### 2. Claude Code identifiserer agent

```
Claude: *Forstår at dette er en invoice-generation oppgave*
        *Velger å bruke: agents/accounting/invoice-generator.md*
```

### 3. Claude Code spawner sub-agent

```
Claude Code → Task tool
  ├─ Agent: general-purpose
  ├─ Prompt: "Les agents/accounting/invoice-generator.md og følg alle steg nøyaktig"
  └─ Context: All data files, memory files, agent context
```

### 4. Sub-agent kjører

```
Sub-agent:
  1. Leser invoice-generator.md
  2. Leser invoice-generator-context.md (læring!)
  3. Leser acme-corp-memory.json (kunde-kontekst!)
  4. Følger prosess steg-for-steg
  5. Genererer faktura
  6. Oppdaterer læring
  7. Committer og pusher
```

### 5. Læring deles via Git

```
Git commit inneholder:
  ├─ data/invoices/2026-001.json (ny faktura)
  ├─ data/memory/acme-corp-memory.json (oppdatert)
  ├─ agents/accounting/invoice-generator-context.md (ny læring!)
  └─ agents/accounting/invoice-generator-memory.json (metrics)

→ Git push

→ Kollega kjører git pull
→ Kollega får ALT, inkludert læringen!
```

### 6. Kollega drar nytte av læringen

```
Kollega: "Lag faktura for Beta AS"

Claude Code (kollegaens instans):
  → Leser invoice-generator.md
  → Leser invoice-generator-context.md
  → Ser: "Tip fra Andre: Acme foretrekker detaljert linjeføring"
  → Bruker denne læringen for Beta AS faktura!
  → Genererer BEDRE faktura!
```

## 📊 Agent Context Format

`agents/accounting/invoice-generator-context.md`:

```markdown
# Invoice Generator - Læring og Kontekst

**Sist oppdatert:** 9. januar 2026 av Andre

---

## 📈 Statistikk

- **Totalt generert:** 25 fakturaer
- **Gjennomsnittlig beløp:** 66.000 kr
- **Success rate:** 100%
- **Gjennomsnittlig tid:** 2 minutter

---

## 💡 Læring fra Tidligere Fakturaer

### #2026-001 - Acme Corporation (9. jan 2026)
- **Læring:** Kunde foretrekker veldig detaljert linjeføring
- **Action:** Split timer i "Design", "Development", "Meetings" i stedet for én linje
- **Resultat:** Kunde fornøyd, rask godkjenning

### #2025-045 - Beta AS (5. jan 2026)
- **Læring:** Kunde ber alltid om justerte beløp
- **Action:** Rund ned til nærmeste 1000kr
- **Resultat:** Ingen justering nødvendig denne gangen

### #2025-032 - Gamma Corp (2. jan 2026)
- **Læring:** Kunde ønsker alltid 45 dagers betalingsfrist
- **Action:** Sett dueDate til 45 dager i stedet av standard 30
- **Resultat:** Ingen klager på betalingsfrist

---

## 🎯 Best Practices

1. **Alltid dobbeltsjekk timer** mot logs/
2. **Bruk kunde-memory** for preferanser
3. **Rund beløp** hvis kunde historisk har bedt om det
4. **Detaljert linjeføring** er alltid bedre
5. **Sjekk tidligere fakturaer** til samme kunde for konsistens

---

## ⚠️  Vanlige Feil å Unngå

1. **Glemme MVA** - Alltid 25% på timer
2. **Feil timepris** - Sjekk project.hourlyRate, ikke hardcode
3. **Manglende forfallsdato** - Alltid sett dueDate
4. **Status ikke draft** - Alltid start med 'draft'

---

## 🔮 Patterns Identifisert

### Kunde-spesifikke patterns:
- **Design-byråer:** Foretrekker detaljert linjeføring
- **Startups:** Foretrekker én linje med total
- **Enterprise:** Krever spesifikk format (sjekk memory!)

### Tids-patterns:
- **Fredager:** Flere fakturaer genereres (ukeslutt)
- **Månedsslutt:** Høy aktivitet (månedslutt-fakturering)

---

## 🚀 Fremtidige Forbedringer

- [ ] Auto-detekter kunde-preferanser fra memory
- [ ] Foreslå optimal linjeføring basert på kunde-type
- [ ] Auto-split timer i kategorier basert på logg-beskrivelser
- [ ] Integration med Fiken for auto-sync

---

**Denne filen oppdateres automatisk etter hver faktura-generering!**
```

## 🎯 Implementeringsplan

### Fase 1: Grunnleggende Agent System (1-2 timer)

1. **Opprett agent-struktur:**
   ```bash
   mkdir -p agents/{sales,accounting,communication,task-management}
   ```

2. **Lag 3 grunnleggende agenter:**
   - `agents/accounting/invoice-generator.md` (komplett definisjon)
   - `agents/accounting/invoice-generator-context.md` (tom, for læring)
   - `agents/accounting/invoice-generator-memory.json` (initial metrics)

3. **Test første agent:**
   ```
   User: "Lag faktura for example-kunde"
   Claude Code → Task tool → general-purpose agent
   → Følger invoice-generator.md
   → Oppdaterer context og memory
   → Committer og pusher
   ```

### Fase 2: Flere Agenter (2-3 timer)

4. **Legg til quote-generator:**
   - `agents/sales/quote-generator.md`
   - `agents/sales/quote-generator-context.md`
   - `agents/sales/quote-generator-memory.json`

5. **Legg til email-drafter:**
   - `agents/communication/email-drafter.md`
   - `agents/communication/email-drafter-context.md`
   - `agents/communication/email-drafter-memory.json`

### Fase 3: Kollegaen Tester (1 time)

6. **Kollega kloner og tester:**
   ```bash
   git clone https://github.com/Digitalspor/terminal-crm.git
   cd terminal-crm
   npm install

   # Kollega lager en faktura
   # → Læringen din er tilgjengelig!
   # → Kollegaens Claude Code bruker din læring
   ```

7. **Verifiser deling:**
   - Kollegaen lager en faktura
   - Pusher til Git
   - Du pullers
   - Du ser kollegaens læring i context-filen!

### Fase 4: Iterasjon og Forbedring (kontinuerlig)

8. **Agentene lærer og forbedres:**
   - Hver gang en agent kjøres, oppdateres context
   - Metrics akkumuleres i memory.json
   - Best practices dokumenteres
   - Patterns identifiseres

## 🌟 Fordeler med Dette Oppsettet

1. **Lokalt og raskt** - Ingen API-latency
2. **Gratis** - Claude Code er lokalt
3. **Delt læring** - Git syncer læring mellom brukere
4. **Kontinuerlig forbedring** - Agenter blir bedre over tid
5. **Transparent** - Alt er synlig i markdown/JSON
6. **Versjonskontroll** - Git history viser hvordan agenter evolves
7. **Ingen vendor lock-in** - Markdown filer, ikke proprietært format
8. **Fleksibelt** - Lett å legge til nye agenter

## 🚀 Neste Steg

1. Lag første agent: invoice-generator
2. Test med begge brukere
3. Verifiser at læring deles
4. Legg til flere agenter gradvis
5. Iterer basert på erfaring

---

**Dette er fremtidens CRM - AI som lærer og deler kunnskap via Git!** 🤖🚀
