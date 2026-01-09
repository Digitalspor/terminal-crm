# 🤖 Agent-forslag for CRM Terminal

Ideer til AI-agenter som kan integreres med CRM-terminalen.

---

## 1. 🧾 Automatisk Fakturerings-agent

**Formål:** Automatiser fakturagenerering basert på timeføring

**Funksjoner:**
- Sjekk timer logget på prosjekter hver måned
- Foreslå fakturaer ved slutten av faktureringsperiode
- Genererer fakturatekst automatisk basert på prosjektbeskrivelse
- Pre-fyller alle felter (kunde, linjer, beløp)
- Push direkte til Fiken med én kommando

**Bruk:**
```bash
npm run crm agent:faktura
# Agent: "Fant 23 timer på Prosjekt X for Kunde Y. Genererer faktura..."
# Agent: "Faktura #2026-001 opprettet. Send til Fiken? [y/n]"
```

**Implementering:**
- Leser `projects/*.json` for timeføring
- Cross-reference med `customers/*.json`
- Genererer `invoices/*.json`
- Integrerer med Fiken API

---

## 2. 📧 Oppfølgings-agent

**Formål:** Hold kontakt med kunder automatisk

**Funksjoner:**
- Sjekker kunder uten aktivitet siste 30/60/90 dager
- Analyserer historikk (prosjekter, e-poster, notater)
- Foreslår oppfølging basert på kontekst
- Drafter personlig e-post
- Integrerer med Gmail-klienten

**Bruk:**
```bash
npm run crm agent:oppfolging
# Agent: "3 kunder mangler oppfølging:"
# Agent: "1. Acme Corp - siste kontakt 45 dager siden"
# Agent: "   Draft e-post? [y/n]"
```

**Intelligens:**
- "Kunde har betalt alle fakturaer → takkemeldinger + nyhetsbrev"
- "Kunde har forfalt faktura → høflig påminnelse"
- "Kunde hadde aktivt prosjekt som er fullført → spør om feedback + nye behov"

---

## 3. 💰 Økonomi-analyse Agent

**Formål:** Månedlig økonomisk innsikt og rapporter

**Funksjoner:**
- Analyserer cashflow (innbetalinger vs utestående)
- Identifiserer forfalte fakturaer
- Trendanalyse (omsetning måned-til-måned)
- Forventet inntekt neste måned basert på aktive prosjekter
- Genererer PDF-rapport for regnskapsfører

**Bruk:**
```bash
npm run crm agent:okonomi --month 2026-01
# Agent genererer rapport: rapport-2026-01.pdf
```

**Innhold i rapport:**
- 📊 Omsetning per måned (graf)
- 💸 Utestående faktura-liste med aldring
- 🎯 Måloppnåelse (sammenlign med budsjett)
- 📈 Trend: opp/ned/stabilt
- ⚠️ Advarsler: forfalte fakturaer, inaktive kunder

---

## 4. 🗓️ Kalender & Møte-agent

**Formål:** Administrer møter med kunder via Claude Canvas

**Funksjoner:**
- Vis kalender med Claude Canvas calendar-widget
- Interaktiv møteplanlegging (klikk for å velge tid)
- Cross-reference med kundedatabase
- Automatisk møteinnkallelse via Gmail
- Legger til hendelser i `notes/{user}/calendar.json`

**Bruk:**
```bash
npm run crm agent:mote --kunde acme-corp
# Åpner Canvas calendar med ledige tider
# Agent: "Valgt tid: torsdag 15. jan kl. 14:00"
# Agent: "Send møteinnkalling til post@acme.no? [y/n]"
```

**Canvas-integrasjon:**
```javascript
import { pickMeetingTime } from 'canvas-api';

const result = await pickMeetingTime({
  calendars: [
    { name: "Deg", color: "blue", events: [...myEvents] },
    { name: "Kunde", color: "green", events: [...customerEvents] }
  ]
});
```

---

## 5. 📝 Notat & Transkripsjon-agent

**Formål:** Ta notater under kundemøter og organisere informasjon

**Funksjoner:**
- Transkriber møteopptak (via Whisper API)
- Trekk ut action items automatisk
- Lagre i `notes/{user}/{customerId}.md`
- Generer oppfølgingsliste
- Send sammendrag til kunde

**Bruk:**
```bash
npm run crm agent:noter --audio mote-acme.mp3
# Agent: "Transkriberer lyd... ferdig!"
# Agent: "Fant 3 action items:"
# Agent: "1. [ ] Sende forslag på redesign innen fredag"
# Agent: "2. [ ] Bestille serverplass hos AWS"
# Agent: "3. [ ]Followe opp på betaling for faktura #2025-042"
```

---

## 6. 📊 Dashboard-oppdaterings Agent

**Formål:** Sanntids dashboard med live data fra Fiken & Gmail

**Funksjoner:**
- Synker Fiken-data automatisk hver time
- Henter nye e-poster fra Gmail
- Oppdaterer blessed-dashboardet live
- Push-notifikasjoner ved viktige hendelser

**Bruk:**
```bash
npm run crm agent:dashboard --live
# Starter blessed-dashboard med auto-refresh
# Agent kjører i bakgrunnen og synker data
```

**Notifikasjoner:**
- 💰 "Ny betaling mottatt: 25 000 kr fra Acme Corp"
- 📧 "Ny e-post fra kunde: support@example.com"
- ⚠️ "Faktura #2026-001 forfaller i morgen!"

---

## 7. 🔍 Kunde-innsikt Agent

**Formål:** Dyp analyse av individuell kunde

**Funksjoner:**
- Henter ALL data om én kunde (prosjekter, fakturaer, e-poster, notater)
- Analyserer kundefornøydhet basert på e-post-tone
- Identifiserer upsell-muligheter
- Visualiserer kundehistorikk i Canvas

**Bruk:**
```bash
npm run crm agent:analyse --kunde acme-corp
```

**Output (Canvas dokument):**
```markdown
# 🔍 Kunde-analyse: Acme Corp

## 📊 Oversikt
- **Total omsetning:** 450 000 kr (siste 12 mnd)
- **Antall prosjekter:** 5 (4 fullført, 1 aktivt)
- **Gjennomsnittlig prosjekt:** 90 000 kr
- **Betalingshistorikk:** ✅ Alltid i tide
- **E-poster:** 47 totalt (34 utgående, 13 innkommende)

## 💡 Innsikter
- ✅ Lojal kunde - 12+ måneders forhold
- 🎯 Upsell-mulighet: "Acme nevnte interesse for app-utvikling i e-post 12. des"
- 📈 Trend: Økende prosjektstørrelse (+40% siste kvartal)

## ⚡ Anbefalinger
1. Foreslå vedlikeholdsavtale (basert på aktivitet)
2. Inviter til strategimøte om app-utvikling
3. Spør om referanse/anbefaling (fornøyd kunde!)
```

---

## 8. 🚀 Prosjekt-tracking Agent

**Formål:** Hold oversikt over prosjektfremdrift og advare om overskridelser

**Funksjoner:**
- Sammenlign faktisk tid vs estimert tid
- Varsle når 80% av budsjettet er brukt
- Foreslå re-estimering hvis nødvendig
- Generer status-rapport for kunde

**Bruk:**
```bash
npm run crm agent:prosjekt --id web-redesign-acme
# Agent: "⚠️ Prosjektet har brukt 22/20 timer (110%)"
# Agent: "Foreslår: øk estimat til 30t eller fakturér tilleggstimer"
# Agent: "Generere status-rapport til kunde? [y/n]"
```

---

## 9. 🔄 Data-synk Agent

**Formål:** Toveis synkronisering mellom CRM og eksterne systemer

**Funksjoner:**
- **Fiken:** Sync kunder, fakturaer, betalinger
- **Gmail:** Arkiver e-poster per kunde
- **Google Calendar:** Synk møter til CRM
- **GitHub:** Koble commits til prosjekter
- **Slack:** Notifikasjoner om CRM-hendelser

**Bruk:**
```bash
npm run crm agent:sync --service fiken
npm run crm agent:sync --service gmail
npm run crm agent:sync --all
```

**Konfigurasjon:**
```json
// sync-config.json
{
  "fiken": {
    "enabled": true,
    "interval": "1h",
    "autoSync": ["customers", "invoices"]
  },
  "gmail": {
    "enabled": true,
    "interval": "15m",
    "autoArchive": true
  }
}
```

---

## 10. 🎨 Canvas Form Builder Agent

**Formål:** Lag interaktive skjemaer for datainput via Claude Canvas

**Funksjoner:**
- Ny kunde-skjema med validering
- Fakturaoppretting med sanntidsberegning
- Prosjekt-setup wizard
- Tidsføringsskjema

**Bruk:**
```bash
npm run crm agent:form --type customer
# Åpner Canvas med interaktivt skjema
# Fylt ut data valideres og lagres automatisk
```

**Eksempel Canvas-form:**
```
╔════════════════════════════════════╗
║      📋 Ny Kunde                   ║
╠════════════════════════════════════╣
║ Firmanavn: [___________________]   ║
║ Org.nr:    [___________________]   ║
║ Kontakt:   [___________________]   ║
║ E-post:    [___________________]   ║
║ Telefon:   [___________________]   ║
║                                    ║
║         [Avbryt]  [Lagre]          ║
╚════════════════════════════════════╝
```

---

## 🛠️ Implementeringsplan

### Fase 1: Grunnleggende agenter (uke 1-2)
- [ ] Automatisk fakturerings-agent
- [ ] Dashboard-oppdaterings agent
- [ ] Data-synk agent (Fiken & Gmail)

### Fase 2: Analyse & innsikt (uke 3-4)
- [ ] Økonomi-analyse agent
- [ ] Kunde-innsikt agent
- [ ] Prosjekt-tracking agent

### Fase 3: Kommunikasjon (uke 5-6)
- [ ] Oppfølgings-agent
- [ ] Notat & transkripsjon-agent
- [ ] Kalender & møte-agent

### Fase 4: UI/UX forbedringer (uke 7-8)
- [ ] Canvas form builder agent
- [ ] Forbedret Canvas-integrasjon

---

## 📚 Teknisk Stack

**Agent Framework:**
- Node.js + ES modules
- Claude API (via @anthropic-ai/sdk)
- Canvas integrasjon (allerede tilgjengelig)

**Datakilder:**
- Lokale JSON-filer (`data/**/*.json`)
- Fiken API
- Gmail API
- Git (for versjonskontroll)

**Tools agentene trenger:**
- `read_file` - Les CRM-data
- `write_file` - Lagre genererte dokumenter
- `execute_command` - Kjør git/npm kommandoer
- `web_search` - Hente eksterne data

---

## 💡 Tips for implementering

1. **Start enkelt:** Implementer én agent av gangen
2. **Test grundig:** Hver agent må håndtere edge cases
3. **Logging:** Alle agent-handlinger logges til `logs/agents/`
4. **Dry-run mode:** Agenter bør ha `--dry-run` flag for testing
5. **Konfigurasjon:** Bruk `agent-config.json` for å enable/disable agenter

---

## 🚀 Kom i gang

```bash
# Installer agent-rammeverk
npm install @anthropic-ai/sdk

# Opprett agent-mappe
mkdir -p src/agents

# Lag første agent
touch src/agents/faktura-agent.js

# Kjør agent
npm run crm agent:faktura
```

---

**Sist oppdatert:** 2026-01-09
**Status:** 💡 Idéfase - klar for implementering!
