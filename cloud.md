# Claude Code - Retningslinjer for CRM Terminal

## VIKTIG: Auto-Commit og Push Workflow

**ALLE endringer skal committes og pushes automatisk etter hver operasjon.**

### Når du gjør endringer

1. **Etter HVER endring av datafiler** (`/data/**/*.json`, `/logs/**/*.md`):
   - Kjør `git add .`
   - Commit med beskrivende melding
   - Push til remote

2. **Etter kodeendringer** (`/src/**/*`):
   - Samme prosedyre: add, commit, push

### Commit-meldinger

Bruk følgende format:

```
<type>: <kort beskrivelse>

<type> kan være:
- customer: Endringer i kundedata
- invoice: Endringer i fakturaer
- project: Endringer i prosjekter
- log: Nye logger eller notater
- feat: Ny funksjonalitet (kode)
- fix: Bugfix (kode)
- docs: Dokumentasjon
```

**Eksempler:**
- `customer: Legg til ny kunde - Acme Corp`
- `invoice: Opprett faktura #2024-001 for Acme Corp`
- `log: Logg 3 timer på Acme redesign`
- `project: Oppdater status til 'in-progress' for Acme redesign`

### Git Workflow Steps

**Før du starter å jobbe:**
```bash
git pull --rebase
```

**Etter hver endring:**
```bash
git add .
git commit -m "<type>: <beskrivelse>"
git push
```

### Håndtering av Merge-konflikter

Hvis `git push` feiler pga. remote changes:

1. Pull med rebase: `git pull --rebase`
2. Hvis konflikt oppstår:
   - Sjekk hvilke filer som har konflikt (`git status`)
   - Åpne og løs konflikter manuelt
   - For JSON-filer: velg nyeste data basert på timestamps
   - For logger: behold begge entries
3. Continue rebase: `git add . && git rebase --continue`
4. Push igjen: `git push`

## Dataformat og Struktur

### Kunder (`/data/customers/<kunde-id>.json`)

```json
{
  "id": "acme-corp",
  "name": "Acme Corporation",
  "contact": {
    "name": "John Doe",
    "email": "john@acme.com",
    "phone": "+47 123 45 678"
  },
  "created": "2024-01-15T10:30:00Z",
  "updated": "2024-01-15T10:30:00Z",
  "notes": "Viktig kunde, foretrekker e-post kommunikasjon"
}
```

### Fakturaer (`/data/invoices/<invoice-id>.json`)

```json
{
  "id": "2024-001",
  "customerId": "acme-corp",
  "date": "2024-01-15",
  "dueDate": "2024-02-14",
  "status": "draft",
  "items": [
    {
      "description": "Webdesign - 40 timer",
      "hours": 40,
      "rate": 1200,
      "amount": 48000
    }
  ],
  "total": 48000,
  "notes": "",
  "created": "2024-01-15T10:30:00Z",
  "updated": "2024-01-15T10:30:00Z"
}
```

### Prosjekter (`/data/projects/<project-id>.json`)

```json
{
  "id": "acme-redesign",
  "name": "Acme Website Redesign",
  "customerId": "acme-corp",
  "status": "in-progress",
  "startDate": "2024-01-15",
  "estimatedHours": 80,
  "spentHours": 12,
  "notes": "Redesign av hele nettsiden, fokus på mobil-first",
  "created": "2024-01-15T10:30:00Z",
  "updated": "2024-01-15T10:30:00Z"
}
```

### Logger (`/logs/YYYY-MM-DD.md`)

```markdown
# 2024-01-15

## 10:30 - Møte med Acme Corp
- Diskutert design-retning
- Valgt fargepalett
- Neste møte: 22. januar

## 14:00 - 17:00 (3t) - Acme Redesign
Kodet nye header-komponenter og responsiv navigasjon.
```

## Arbeidsflyt i Claude Code

### Når brukeren ber om å:

**"Legg til ny kunde"**
1. Spør om nødvendig info (navn, kontakt, etc.)
2. Generer ID fra navn (lowercase, slugified)
3. Opprett `/data/customers/<id>.json`
4. Add, commit med `customer: Legg til <navn>`, push

**"Opprett faktura"**
1. List tilgjengelige kunder
2. Spør om detaljer (items, priser)
3. Generer faktura-ID (YYYY-NNN format)
4. Opprett `/data/invoices/<id>.json`
5. Add, commit med `invoice: Opprett faktura #<id> for <kunde>`, push

**"Logg timer"**
1. Spør om dato, prosjekt, timer, beskrivelse
2. Åpne/opprett `/logs/YYYY-MM-DD.md`
3. Legg til entry
4. Oppdater `spentHours` i prosjekt-fil
5. Add, commit med `log: Logg <timer>t på <prosjekt>`, push

**"Vis oversikt"**
1. Les relevante filer fra `/data/`
2. Presenter i strukturert format i terminalen
3. Ingen commit nødvendig (ingen endringer)

## 🚨 KRITISKE GUARDRAILS - Fiken API

**EKSTREMT VIKTIG**: Fiken API sender fakturaer til EKTE kunder. Følg disse reglene strengt.

### Guardrail #1: ALDRI Send Faktura Uten Eksplisitt Bekreftelse

**Regel**: Spør ALLTID brukeren før du sender faktura til Fiken.

```
❌ FEIL:
User: "Lag faktura for Acme"
Claude: *Lager faktura OG sender til Fiken automatisk* ← ALDRI gjør dette!

✅ RIKTIG:
User: "Lag faktura for Acme"
Claude: *Lager faktura LOKALT*
Claude: "Faktura #2024-001 opprettet lokalt. Vil du sende den til Fiken?"
User: "Ja, send til Fiken"
Claude: *NÅ sender til Fiken*
```

### Guardrail #2: Dobbeltsjekk Før Sending

Før du sender til Fiken, vis ALLTID sammendrag:

```
Faktura klar for sending til Fiken:

📄 Faktura: #2024-001
👤 Kunde: Acme Corporation (john@acme.com)
💰 Beløp: 72.000 kr (inkl. 25% MVA)
📅 Forfallsdato: 14. februar 2025

Linjer:
- 40t Webdesign @ 1200kr = 48.000 kr
- 8t Møter @ 1200kr = 9.600 kr

⚠️  Dette vil sende EKTE faktura til kunde via Fiken!

Bekreft: [Y/n]
```

### Guardrail #3: Kun Draft-Status

**Regel**: Fakturaer MÅ ha `status: "draft"` lokalt før sending til Fiken.

```javascript
// Sjekk status før sending
if (invoice.status !== 'draft') {
  throw new Error('Kan ikke sende faktura som ikke er draft')
}

// Sjekk om allerede sendt
if (invoice.fikenSynced === true) {
  throw new Error('Faktura allerede synket til Fiken - vil ikke sende duplikat')
}
```

### Guardrail #4: Logg Alt

**Regel**: Hver sending til Fiken skal logges.

```javascript
// Opprett logg-entry
const logEntry = {
  timestamp: new Date().toISOString(),
  action: 'fiken-send-invoice',
  invoiceId: invoice.id,
  customerId: invoice.customerId,
  amount: invoice.total,
  fikenId: result.invoiceId,
  sentBy: await userContext.getUserId()
}

// Lagre i data/logs/fiken-actions.json
```

### Guardrail #5: Aldri i Test/Demo-Mode

**Regel**: Hvis du er usikker, IKKE send til Fiken.

```
If doubt, DON'T SEND!

Spør heller brukeren:
"Jeg er usikker om jeg skal sende denne fakturaen til Fiken.
 Vil du at jeg skal gjøre det?"
```

### Fiken Send-Workflow (Komplett)

```
1. User: "Send faktura #2024-001 til Fiken"

2. Claude SJEKKER:
   ✓ Faktura finnes lokalt?
   ✓ Status er 'draft'?
   ✓ Ikke allerede synket (fikenSynced !== true)?
   ✓ Kunde har fikenId?
   ✓ Alle required felter utfylt?

3. Claude VISER sammendrag og BER OM BEKREFTELSE

4. User: "Ja, send"

5. Claude SENDER til Fiken API

6. Claude OPPDATERER lokal faktura:
   - fikenId: <mottatt ID>
   - fikenSynced: true
   - status: 'sent'
   - sentAt: <timestamp>
   - sentBy: <user-id>

7. Claude LOGGER action i fiken-actions.json

8. Claude COMMITTER og PUSHER

9. Claude BEKREFTER til bruker:
   "✓ Faktura #2024-001 sendt til Fiken (ID: fiken-123)"
```

### Nødstopp-Kommandoer

Hvis noe går galt:

```bash
# Hvis du ved et uhell sendte feil faktura:
# 1. Logg inn på Fiken web interface
# 2. Slett fakturaen manuelt
# 3. Oppdater lokal faktura: fikenSynced: false
# 4. Commit endring

# Hvis Fiken API er nede:
# Ikke prøv på nytt automatisk
# Informer brukeren og vent
```

## Viktige Prinsipper

1. **Git er source of truth** - Alltid commit/push endringer
2. **Atomære commits** - En commit per logisk endring
3. **Pull først** - Alltid kjør `git pull` før nye endringer
4. **Beskrivende meldinger** - Commit-meldinger skal være klare og strukturerte
5. **Timestamps** - Alltid bruk ISO 8601 format for datoer
6. **ID-generering** - Bruk konsistente, slugified IDer
7. **Fiken Guardrails** - ALLTID følg guardrails for Fiken API (se over)

## Feilhåndtering

- Hvis git push feiler → pull, rebase, resolve conflicts, push
- Hvis JSON parsing feiler → vis feil, ikke ødelegg eksisterende data
- Hvis fil ikke finnes → opprett ny med fornuftige defaults

## Fremtidige Forbedringer

Hvis dere senere vil gå over til database:
- Behold samme JSON-struktur som database schema
- Migrer filer til database med scripts
- Legg til API-lag

Hvis dere vil ha sanntid:
- Legg til WebSocket-server
- Broadcaster endringer til åpne klienter
- Behold Git som backup/audit log
