# Claude Canvas Dashboard Plan

## 🎨 Visuelt Dashboard med Claude Canvas

Claude Canvas lar oss lage interaktive terminal-baserte UI-komponenter.

## 📊 Dashboard Komponenter

### 1. Hovedoversikt (Dashboard Home)

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 CRM Dashboard                        9. januar 2026      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📋 Kunder                          💰 Økonomioversikt       │
│ ├─ Totalt: 12                     ├─ Utestående: 85 000 kr │
│ ├─ Aktive: 8                      ├─ Fakturert i mnd: 120k │
│ └─ Nye (30d): 3                   └─ Betalt i mnd: 95k     │
│                                                              │
│ 🚀 Prosjekter                     ⏰ Dine påminnelser       │
│ ├─ Pågående: 5                    ├─ I dag: 2              │
│ ├─ Fullført: 23                   ├─ Denne uken: 4         │
│ └─ Forsinket: 1 ⚠️                └─ Forfalt: 1 🔴         │
│                                                              │
│ 📅 Kalender (7 dager)             📧 E-post                 │
│ ├─ 9.jan - Møte Acme (10:00)     ├─ Uleste: 5             │
│ ├─ 10.jan - Deadline Beta Launch  └─ Trenger svar: 2       │
│ └─ 12.jan - Faktura Acme forfaller                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [1] Kunder  [2] Prosjekter  [3] Fakturaer  [4] Kalender    │
│ [5] Påminnelser  [6] E-post  [7] Rapporter  [q] Avslutt    │
└─────────────────────────────────────────────────────────────┘
```

### 2. Kunde-oversikt (Customer Dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Kunder                                                    │
├─────────────────────────────────────────────────────────────┤
│ [Filtre: Alle ▼] [Sorter: Navn ▼] [Søk: _______]           │
│                                                              │
│ ┌─ Acme Corporation (acme-corp)                             │
│ │  📧 john@acme.com | 📞 +47 123 45 678                     │
│ │  🚀 2 aktive prosjekter | 💰 72.000 kr utestående         │
│ │  📝 Siste notat: "Ønsker møte om fase 2" (7. jan)        │
│ │  🧠 Memory: 12 interaksjoner, høy verdi kunde             │
│ │  [Vis detaljer] [Ny faktura] [Send e-post]               │
│ └───────────────────────────────────────────────────────────│
│                                                              │
│ ┌─ Beta AS (beta-as)                                        │
│ │  📧 post@beta.no | 📞 +47 987 65 432                      │
│ │  🚀 1 aktivt prosjekt | 💰 48.000 kr utestående           │
│ │  📝 Siste notat: "Fornøyd med progresjon" (8. jan)       │
│ │  🧠 Memory: 5 interaksjoner, ny kunde                     │
│ │  [Vis detaljer] [Ny faktura] [Send e-post]               │
│ └───────────────────────────────────────────────────────────│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [n] Ny kunde  [f] Filtrer  [s] Søk  [←] Tilbake            │
└─────────────────────────────────────────────────────────────┘
```

### 3. Kunde-detaljer (Customer Detail)

```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Acme Corporation                                          │
├─────────────────────────────────────────────────────────────┤
│ 📇 Info                                                      │
│ ├─ Kontakt: John Doe                                        │
│ ├─ E-post: john@acme.com                                    │
│ ├─ Telefon: +47 123 45 678                                  │
│ ├─ Org.nr: 123456789                                        │
│ └─ Kunde siden: 15. januar 2024                             │
│                                                              │
│ 🚀 Prosjekter (2 aktive)                                    │
│ ├─ Website Redesign (in-progress) 48/80t                    │
│ └─ E-commerce Platform (planning) 0/120t                    │
│                                                              │
│ 💰 Økonomi                                                   │
│ ├─ Utestående: 72.000 kr (2 fakturaer)                      │
│ ├─ Totalt fakturert: 340.000 kr                             │
│ └─ Lifetime value: 420.000 kr                               │
│                                                              │
│ 📝 Notater (fra deg - Andre)                                │
│ ├─ 7.jan: "Møte om fase 2 - de ønsker mer funksjoner"      │
│ ├─ 5.jan: "Veldig fornøyd med progresjon så langt"         │
│ └─ [Vis alle notater] [Legg til notat]                     │
│                                                              │
│ 🧠 AI Memory & Context                                      │
│ ├─ Interaksjoner: 12                                        │
│ ├─ Sentiment: Veldig positiv (90%)                          │
│ ├─ Preferanser: E-post, detaljerte statusoppdateringer      │
│ ├─ Nøkkelpunkter: Fokus på brukervennlighet, mobil-first   │
│ └─ [Vis full kontekst] [Oppdater memory]                   │
│                                                              │
│ 📧 E-post historikk                                          │
│ ├─ 8.jan: "Re: Website design feedback" (inn)              │
│ ├─ 7.jan: "Status update - Week 2" (ut)                    │
│ └─ [Vis alle e-poster]                                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [e] E-post  [f] Faktura  [p] Prosjekt  [n] Notat  [←] Tilbake│
└─────────────────────────────────────────────────────────────┘
```

### 4. Kalender-visning

```
┌─────────────────────────────────────────────────────────────┐
│ 📅 Kalender - Januar 2026                                    │
├─────────────────────────────────────────────────────────────┤
│    Man    Tir    Ons    Tor    Fre    Lør    Søn           │
│                     1      2      3      4      5            │
│     6      7      8    [ 9 ]   10     11     12            │
│    13     14     15     16     17     18     19            │
│    20     21     22     23     24     25     26            │
│    27     28     29     30     31                           │
│                                                              │
│ Valgt: 9. januar 2026                                       │
│                                                              │
│ ┌─ 10:00 - 11:00 | Møte: Acme Corporation                   │
│ │  📍 Google Meet                                           │
│ │  📝 Diskutere fase 2 av redesign                          │
│ │  👤 John Doe (Acme)                                       │
│ │  [Vis detaljer] [Rediger] [Avbryt]                       │
│ └───────────────────────────────────────────────────────────│
│                                                              │
│ ┌─ 14:00 - 15:00 | Internt: Sprint planning                │
│ │  📝 Planlegge neste sprint                                │
│ │  [Vis detaljer]                                           │
│ └───────────────────────────────────────────────────────────│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [n] Nytt event  [w] Neste uke  [m] Neste måned  [←] Tilbake│
└─────────────────────────────────────────────────────────────┘
```

### 5. Faktura-oversikt

```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Fakturaer                                                 │
├─────────────────────────────────────────────────────────────┤
│ [Status: Alle ▼] [Sorter: Nyeste ▼]                        │
│                                                              │
│ ┌─ #2024-001 | Acme Corporation | 72.000 kr                 │
│ │  📅 Utstedt: 15.des 2024 | Forfall: 14.jan 2025          │
│ │  🔴 FORFALT (5 dager)                                     │
│ │  📦 40t design + 8t møter                                 │
│ │  ☁️  Fiken: Ikke synket                                   │
│ │  [Vis faktura] [Send påminnelse] [Sync til Fiken]        │
│ └───────────────────────────────────────────────────────────│
│                                                              │
│ ┌─ #2024-002 | Beta AS | 48.000 kr                          │
│ │  📅 Utstedt: 2.jan 2025 | Forfall: 1.feb 2025            │
│ │  🟡 SENDT (28 dager til forfall)                          │
│ │  📦 30t frontend utvikling                                │
│ │  ☁️  Fiken: Synket ✓                                      │
│ │  [Vis faktura] [Marker som betalt]                       │
│ └───────────────────────────────────────────────────────────│
│                                                              │
│ Totalt utestående: 120.000 kr                               │
│ Forfalt: 72.000 kr 🔴                                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [n] Ny faktura  [f] Fiken sync  [r] Rapporter  [←] Tilbake │
└─────────────────────────────────────────────────────────────┘
```

## 🎮 Interaksjon med Dashboard

### Hvordan Canvas Funker

Claude Code kan spawne Canvas med `/canvas` skill eller når brukeren ber om det.

**Eksempel-dialog:**

```
User: "Vis meg en oversikt over alle kunder"

Claude: *Spawner Canvas med kunde-oversikt dashboard*

User: *Velger "Acme Corporation" i Canvas*

Claude: *Oppdaterer Canvas til kunde-detaljer for Acme*

User: "Lag en faktura for dette prosjektet"

Claude: *Leser agents/accounting/invoice-generator.md*
Claude: *Genererer faktura*
Claude: *Oppdaterer Canvas med ny faktura*
Claude: *Committer og pusher*
```

### Canvas Commands

```bash
# Vis hovedoversikt
npm run crm dashboard

# Vis kunder
npm run crm dashboard:customers

# Vis kunde-detaljer
npm run crm dashboard:customer <kunde-id>

# Vis kalender
npm run crm dashboard:calendar

# Vis fakturaer
npm run crm dashboard:invoices
```

Men igjen: **Brukeren spør bare Claude Code direkte!**

## 📊 Data Flows i Dashboard

```
Git Repository (Source of Truth)
        ↓
    Data Manager (JavaScript)
        ↓
    Canvas Renderer (Claude Code)
        ↓
    Terminal UI (Interactive)
        ↓
    User Input
        ↓
    Claude Code Actions
        ↓
    Git Commit + Push
```

## 🎨 Canvas Styling Guidelines

### Farger (via chalk)

- 🟢 **Grønn**: Positive statuser, fullført, betalt
- 🟡 **Gul**: Warnings, pending, under arbeid
- 🔴 **Rød**: Feil, forfalt, kritisk
- 🔵 **Blå**: Info, links, navigasjon
- ⚪ **Hvit**: Normal tekst
- 🟤 **Grå**: Sekundær info, disabled

### Ikoner (Emojis)

- 📋 Kunder/lister
- 💰 Økonomi/fakturaer
- 🚀 Prosjekter
- 📧 E-post
- 📅 Kalender
- ⏰ Påminnelser
- 🧠 AI/memory/context
- 👤 Person/kontakt
- 📝 Notater
- ✅ Success/completed
- ⚠️  Warning
- 🔴 Error/critical
- ☁️  Cloud/Fiken sync

## 🔄 Real-time Updates

Dashboard oppdateres når:
1. **Git pull** henter nye endringer
2. **Bruker gjør endringer** lokalt
3. **Kollegaen pusher** endringer

Canvas kan refreshes:
- Automatisk (når Claude Code ser endringer)
- Manuelt (bruker trykker refresh-knapp)
- Ved navigasjon (bytte view)

## 💡 Best Practices

### For Claude Code:

1. **Alltid bruk Canvas** for visuelle oversikter
2. **Oppdater Canvas** etter endringer
3. **Bruk ikoner og farger** konsistent
4. **Gjør det interaktivt** - la brukeren velge i Canvas
5. **Kombiner med agents** - Canvas → velg → agent → resultat

### For Brukerne:

1. **Spør om oversikter**: "Vis meg alle kunder"
2. **Naviger i Canvas**: Velg elementer direkte
3. **Be om actions**: "Lag faktura for valgt prosjekt"
4. **Refresh**: "Oppdater oversikten"

## 🚀 Implementering

### Steg 1: Grunnleggende Dashboard

```javascript
// src/canvas-dashboard.js
import { Skill } from 'claude-code';

export async function showMainDashboard() {
  const customers = await dataManager.listCustomers();
  const projects = await dataManager.listProjects();
  const invoices = await dataManager.listInvoices();
  const reminders = await notesManager.getReminders();

  // Build dashboard data
  const dashboardData = {
    customers: {
      total: customers.length,
      active: customers.filter(c => /* has active projects */).length,
      new: customers.filter(c => /* created last 30 days */).length
    },
    economy: {
      outstanding: invoices.filter(i => i.status !== 'paid')
        .reduce((sum, i) => sum + i.total, 0),
      // etc...
    },
    // ...
  };

  // Spawn Canvas
  await Skill('canvas', JSON.stringify(dashboardData));
}
```

### Steg 2: Interaktivitet

Canvas sender events tilbake til Claude Code når brukeren interagerer.

### Steg 3: Integration med Agents

Når bruker velger noe i Canvas → trigger agent workflow.

## 📈 Fremtidige Features

1. **Sanntids-grafer**: Inntekter over tid, prosjekt-progresjon
2. **Notifikasjoner**: Popup for forfalt fakturaer, nye e-poster
3. **Filters og søk**: Dynamisk filtrering i Canvas
4. **Drag-and-drop**: Flytte oppgaver mellom statuser
5. **Multi-view**: Split-screen med flere Canvas samtidig
6. **Temaer**: Dark mode, custom farger

## 🎯 Mål

Et visuelt, interaktivt dashboard som:
- ✅ Fungerer i terminalen
- ✅ Er Git-basert (ingen database)
- ✅ Delt mellom to brukere
- ✅ Oppdateres automatisk ved pull
- ✅ Integrert med AI agents
- ✅ Enkel og rask å bruke
