# Agent CRM - Komplett Prosjektplan

> AI-drevet Agency Operations Platform for DigitalSpor & Vodacom

---

## 🎯 Prosjektmål

Bygge et internt CRM-system som automatiserer arbeidsflyten:
**Email → Oppgave → Plan → Utførelse → Kundesvar → Faktura**

### Brukere

- 2 teammedlemmer (DigitalSpor + Vodacom)

### Kjerneproblemer som løses

1. **Manuell email-håndtering** → Automatisk oppgaveoppretting
2. **Manuell planlegging** → AI-assistert planlegging med godkjenning
3. **Manuell utførelse** → CLI/API-basert utførelse på nettsteder
4. **Manuell kundeoppfølging** → Automatiske statuser med screenshots
5. **Manuell timeføring/fakturering** → Automatiske fakturakladder

---

## 🏗️ Arkitektur

### Tech Stack

| Komponent   | Teknologi                                             |
| ----------- | ----------------------------------------------------- |
| Frontend    | Next.js 15.3.3, React 19, Tailwind v4, Flowbite React |
| Backend     | Next.js API Routes + Agent Server (Express)           |
| Database    | PostgreSQL via Supabase (lokalt)                      |
| AI          | Anthropic Claude Sonnet 4.5                           |
| Fakturering | Fiken (DigitalSpor) + Tripletex (Vodacom)             |
| Email       | Gmail API                                             |
| Utførelse   | WP-CLI, Vercel CLI, Supabase CLI                      |

### Systemdiagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          GMAIL INBOX                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ (Gmail API / Webhook)
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🤖 AGENT 1: EMAIL ANALYZER                        │
│  - Klassifiserer email (support/feature/bug/project)                 │
│  - Identifiserer kunde                                               │
│  - Oppretter oppgave i dashboard                                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         📋 OPPGAVE I DASHBOARD                       │
│  Status: "Ny" → Venter på planlegging                                │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🤖 AGENT 2: TASK PLANNER                          │
│  - Analyserer oppgaven                                               │
│  - Lager detaljert plan med steg                                     │
│  - Estimerer tid                                                     │
│  - Foreslår CLI-kommandoer                                           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│               ✋ MANUELL GODKJENNING (Dashboard)                     │
│  [ ] Godkjenn plan                                                   │
│  [ ] Avvis / be om endringer                                         │
└─────────┬───────────────────────────────────────────┬───────────────┘
          │ Godkjent                                  │ Avvist
          ▼                                           ▼
┌─────────────────────────────────┐    ┌──────────────────────────────┐
│  🤖 AGENT 3: TASK EXECUTOR      │    │  Tilbake til planlegging     │
│  - Kobler til kundens nettsted  │    └──────────────────────────────┘
│  - Kjører WP-CLI / API-kall     │
│  - Logger alle endringer        │
│  - Tar Playwright screenshots   │
└────────────────────────────────┬┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🤖 AGENT 4: CLIENT RESPONDER                      │
│  - Skriver svar-email til kunde                                      │
│  - Beskriver hva som ble gjort                                       │
│  - Legger ved screenshots (valgfritt)                                │
│  - Sender via Gmail API                                              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🤖 AGENT 5: INVOICE DRAFTER                       │
│  - Beregner timer fra oppgave                                        │
│  - Lager fakturakladd                                                │
│  - DigitalSpor kunder → Fiken                                        │
│  - Vodacom kunder → Tripletex                                        │
│  - ALDRI sender faktura automatisk                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agenter (5 stk - Forenklet)

| #   | Agent                | Trigger                 | Input            | Output            | Godkjenning              |
| --- | -------------------- | ----------------------- | ---------------- | ----------------- | ------------------------ |
| 1   | **Email Analyzer**   | Gmail webhook / polling | Email            | Oppgave opprettet | Nei                      |
| 2   | **Task Planner**     | Ny oppgave i DB         | Oppgave          | Plan med steg     | **JA**                   |
| 3   | **Task Executor**    | Plan godkjent           | Godkjent plan    | Utført arbeid     | Nei (pre-godkjent)       |
| 4   | **Client Responder** | Oppgave fullført        | Fullført oppgave | Email sendt       | Nei                      |
| 5   | **Invoice Drafter**  | Timer logget            | Timer + oppgave  | Fakturakladd      | **JA** (manuell sending) |

### Hvorfor kun 5 agenter?

Det originale prosjektet hadde 30+ agenter. For intern bruk trenger vi:

- **Færre, men mer robuste agenter**
- **Tydelig ansvarsfordeling**
- **Enklere debugging**
- **Lavere API-kostnader**

Vi kan utvide senere hvis behov oppstår.

---

## 📊 Database-skjema (Forenklet)

### Kjernetabeller

```sql
-- Agencies (DigitalSpor + Vodacom)
agencies
├── id, name, billing_system (fiken/tripletex)
└── tripletex_project_id (for Vodacom timeføring)

-- Team Members (2 brukere)
team_members
├── id, agency_id, email, name, role
└── gmail_token (for email-tilgang)

-- Customers (sub-kunder under Vodacom + egne kunder)
customers
├── id, agency_id, name, org_number
├── wordpress_url, wordpress_credentials
└── billing_email

-- Tasks (Kjernen av systemet)
tasks
├── id, agency_id, customer_id
├── title, description, status
├── source (email/manual), source_email_id
├── plan_json (fra Task Planner)
├── plan_approved_at, plan_approved_by
├── executed_at, execution_log
├── hours_spent, hourly_rate
└── invoice_draft_id

-- Time Entries (Timeføring)
time_entries
├── id, task_id, team_member_id
├── hours, date, description
└── synced_to_tripletex (for Vodacom)

-- Invoice Drafts
invoice_drafts
├── id, customer_id, task_ids[]
├── line_items_json, subtotal, vat, total
├── billing_system (fiken/tripletex)
├── status (draft/approved/sent)
└── external_id (fiken/tripletex ID)

-- Emails (Lagring av prosesserte emails)
emails
├── id, gmail_message_id, thread_id
├── from_email, subject, body_text
├── classification_json
├── task_id (kobling til oppgave)
└── processed_at
```

### Vodacom-spesifikk struktur

```sql
-- Vodacom har sub-kunder
customers
├── agency_id = vodacom_agency_id
├── parent_customer_id = NULL (Vodacom selv)
└── parent_customer_id = vodacom_id (sub-kunder)

-- Timer på Vodacom prosjekter → Tripletex
time_entries
├── task_id → task.customer_id → customer.agency_id = vodacom
└── synced_to_tripletex = true/false
```

---

## 📅 Implementeringsfaser

### Fase 1: Fundament ✅

**Mål**: Grunnleggende app som kjører

- [x] Kopiere UI-kit til prosjektrot
- [x] Sette opp Supabase lokalt
- [x] Kjøre database-migrasjoner
- [x] Grunnleggende auth (2 brukere)
- [x] Dashboard-layout med navigasjon

**Status**: Fullført

### Fase 2: Oppgavesystem ✅

**Mål**: Manuelt opprette og håndtere oppgaver

- [x] Tasks CRUD (list, create, view, edit)
- [x] Customers CRUD
- [x] Time entries CRUD
- [x] Oppgavestatus-workflow (ny → planlagt → godkjent → utført → fakturert)
- [x] Plan-visning og godkjenningsknapp

**Status**: Fullført

### Fase 3: Gmail-integrasjon ✅

**Mål**: Emails blir til oppgaver

- [x] Gmail OAuth setup
- [x] Email polling (hvert 5. minutt)
- [x] **Agent 1: Email Analyzer**
  - Klassifiserer email
  - Identifiserer/oppretter kunde
  - Oppretter oppgave
- [x] Email → Oppgave kobling i UI

**Status**: Fullført

### Fase 4: Task Planner Agent ✅

**Mål**: AI lager planer for oppgaver

- [x] **Agent 2: Task Planner**
  - Analyserer oppgavebeskrivelse
  - Genererer plan med steg
  - Foreslår CLI-kommandoer
  - Estimerer tid
- [x] Plan-visning i oppgavedetaljer
- [x] Godkjennings-UI med kommentarer

**Status**: Fullført

### Fase 5: Task Executor Agent ✅

**Mål**: Godkjente planer utføres automatisk

- [x] **Agent 3: Task Executor**
  - Kobler til kundens WordPress (WP-CLI via SSH)
  - Eller API-kall for andre systemer
  - Logger alle handlinger
  - Tar screenshots med Playwright
- [x] Execution log i oppgavedetaljer
- [ ] Screenshot-galleri (delvis implementert)

**Status**: Fullført (screenshots mangler UI-galleri)

### Fase 6: Client Responder Agent ✅

**Mål**: Kunder får automatisk svar

- [x] **Agent 4: Client Responder**
  - Genererer profesjonell email
  - Beskriver utførte endringer
  - Legger ved screenshots (valgfritt)
  - Sender via Gmail API
- [x] Sendt-status på oppgave

**Status**: Fullført

### Fase 7: Fakturering ✅

**Mål**: Fakturakladder opprettes automatisk

- [x] **Agent 5: Invoice Drafter**
  - Beregner timer fra time_entries
  - Lager fakturakladd
  - Fiken API for DigitalSpor-kunder
  - Tripletex API for Vodacom-kunder
- [x] Fakturakladd-liste i dashboard
- [x] Manuell "Send faktura" i Fiken/Tripletex

**Status**: Fullført (Tripletex venter på API-tilgang)

### Fase 8: Polish & Deploy 🔄

**Mål**: Produksjonsklar

- [ ] Error handling på alle agenter
- [ ] Retry-logikk for API-feil
- [ ] Logging og monitoring
- [x] Deploy frontend til Vercel ✅ (https://agent-crm-ten.vercel.app)
- [ ] Deploy agent-server til Railway ← **NESTE STEG**
- [x] Supabase Cloud (bruker hosted Supabase)

**Status**: Pågår - Frontend live, agents-server venter på Railway

---

## 🔑 Integrasjoner

### Gmail

```typescript
// Delt innboks - begge brukere har tilgang
// OAuth 2.0 tokens lagret i agency_integrations
// Polling hvert 5. minutt
```

### WP-CLI (via SSH - Kinsta)

```typescript
// Hver bruker har egen SSH-nøkkel på Kinsta
// SSH-nøkler lagret i team_members.ssh_private_key (kryptert)
// Kundens site-info lagret i customers.kinsta_site_id
// Eksempel: ssh user@site.kinsta.cloud "cd /www/site/public && wp plugin update --all"
```

### Fiken API

```typescript
// Base URL: https://api.fiken.no/api/v2
// Auth: Bearer token
// For: Fakturaer til DigitalSpor-kunder
```

### Tripletex API (Fase 2 - Venter)

```typescript
// TODO: Settes opp senere når API-tilgang er klar
// For: Timer og fakturaer for Vodacom-prosjekter
// Foreløpig: Manuell timeføring i Tripletex
```

---

## 📁 Prosjektstruktur

```
agent-crm/
├── app/                           # Next.js 15 frontend
│   ├── (dashboard)/               # Protected routes
│   │   ├── layout.tsx             # Sidebar + Navbar
│   │   ├── tasks/                 # Oppgaver
│   │   │   ├── page.tsx           # Liste
│   │   │   ├── [id]/page.tsx      # Detaljer + plan
│   │   │   └── new/page.tsx       # Opprett manuelt
│   │   ├── customers/             # Kunder
│   │   ├── invoices/              # Fakturakladder
│   │   ├── time/                  # Timeføring
│   │   └── settings/              # Innstillinger
│   ├── api/
│   │   ├── tasks/route.ts         # CRUD
│   │   ├── customers/route.ts
│   │   ├── gmail/
│   │   │   ├── webhook/route.ts   # Gmail push
│   │   │   └── poll/route.ts      # Manual poll
│   │   └── agents/
│   │       └── run/route.ts       # Trigger agent
│   └── lib/
│       ├── supabase/
│       ├── gmail/
│       ├── fiken/
│       └── tripletex/
│
├── agents-server/                  # Agent runtime (Express)
│   ├── src/
│   │   ├── index.ts               # Cron + listeners
│   │   ├── agents/
│   │   │   ├── email-analyzer.ts
│   │   │   ├── task-planner.ts
│   │   │   ├── task-executor.ts
│   │   │   ├── client-responder.ts
│   │   │   └── invoice-drafter.ts
│   │   ├── core/
│   │   │   ├── agent-runner.ts    # Claude API wrapper
│   │   │   ├── event-listener.ts  # Supabase Realtime
│   │   │   └── tools/
│   │   │       ├── wp-cli.ts
│   │   │       ├── gmail.ts
│   │   │       ├── fiken.ts
│   │   │       ├── tripletex.ts
│   │   │       └── playwright.ts
│   │   └── cron/
│   │       └── email-poll.ts      # Hvert 5. minutt
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
│
├── ui/                             # Flowbite Pro kit (referanse)
│   └── flowbite-pro-nextjs-admin-dashboard-main/
│
├── AGENTS.md                       # Amp kontekst
├── plan/
│   └── PLAN.md                     # Denne filen
└── package.json
```

---

## ⚠️ Viktige Beslutninger

### 1. Godkjenningspunkter

| Steg            | Automatisk?               | Begrunnelse                             |
| --------------- | ------------------------- | --------------------------------------- |
| Email → Oppgave | ✅ Ja                     | Trygt, ingen endringer på kundesystemer |
| Plan generert   | ❌ Nei                    | **Må godkjennes** før utførelse         |
| Utførelse       | ✅ Ja (etter godkjenning) | Plan er pre-godkjent                    |
| Kundesvar       | ✅ Ja                     | Basert på faktisk utført arbeid         |
| Fakturakladd    | ✅ Ja                     | Men **sending er alltid manuell**       |

### 2. Sikkerhet

- **Aldri** lagre passord i plaintext (bruk Supabase Vault)
- **Aldri** sende faktura automatisk
- **Alltid** ta backup før WP-CLI operasjoner
- **Alltid** logge alle agent-handlinger

### 3. Feilhåndtering

- Hvis agent feiler: Logg til DB, varsle på Slack/email
- Automatisk retry med exponential backoff (max 3 forsøk)
- Dashboard-visning av feilede oppgaver

---

## 💰 Kostnadsestimat

### Infrastruktur (månedlig)

| Tjeneste        | Kostnad |
| --------------- | ------- |
| Supabase (Pro)  | $25     |
| Vercel (Pro)    | $20     |
| Railway (Hobby) | $5-10   |
| **Total infra** | ~$50-55 |

### API-bruk (månedlig estimat)

| Tjeneste      | Estimat                    |
| ------------- | -------------------------- |
| Claude API    | $30-80 (avhenger av volum) |
| Gmail API     | Gratis                     |
| Fiken API     | Gratis                     |
| Tripletex API | Gratis                     |
| **Total API** | ~$30-80                    |

### Totalt

**~$80-135/mnd** for komplett system

---

## ✅ Success Criteria

### MVP (Fase 1-4) ✅ FULLFØRT

- [x] Emails blir automatisk til oppgaver
- [x] AI genererer planer som kan godkjennes
- [x] Dashboard viser alle oppgaver med status

### Full Versjon (Fase 1-7) ✅ FULLFØRT

- [x] Godkjente planer utføres automatisk
- [x] Kunder får svar med status
- [x] Fakturakladder opprettes automatisk

### Production Ready (Fase 8) 🔄 PÅGÅR

- [x] Frontend deployed til Vercel
- [ ] agents-server deployed til Railway ← **NESTE**
- [ ] Ingen kritiske feil i 1 uke
- [ ] Alle 5 agenter fungerer end-to-end i prod
- [ ] Logging og monitoring på plass

---

## 📝 Neste Steg (Oppdatert 30. des 2024)

1. **Deploy agents-server til Railway**
   - Se `docs/DEPLOY.md` for guide
   - Legg til `ANTHROPIC_API_KEY` og `SUPABASE_SERVICE_ROLE_KEY`
2. **Test full workflow i prod**
   - Email → Task → Plan → Execute → Response
3. **Sett opp monitoring**
   - Error alerts
   - Agent execution logs
4. **Tripletex API-tilgang** (venter på Vodacom)

---

## 📚 Dokumentasjon

| Fil | Innhold |
|-----|---------|
| `AGENTS.md` | Quick context, kommandoer, env vars |
| `CHANGELOG.md` | Endringslogg |
| `docs/DEPLOY.md` | Vercel + Railway deployment guide |
| `docs/GMAIL_OAUTH_SETUP.md` | Gmail OAuth oppsett |
| `plan/PLAN.md` | Denne filen - detaljert prosjektplan |
| `plan/ROADMAP.md` | Fremtidige features (Agent 6 etc.) |

---

*Sist oppdatert: 30. desember 2024*
