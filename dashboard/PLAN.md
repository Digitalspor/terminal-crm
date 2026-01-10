# CRM Terminal - Utviklingsplan

> Sist oppdatert: 2026-01-10
> Status: Klar for Supabase + Vercel migrering

---

## 1. Nåværende Status

### Ferdig implementert
- [x] Dashboard med Flowbite Pro (Next.js 16, Turbopack)
- [x] Fiken API integrasjon (fakturaer, kostnader, banksaldo)
- [x] Kundeliste og kundedetaljer
- [x] Økonomi-oversikt med kontantstrøm
- [x] Auto-sync script (git commit/push ved endringer)
- [x] Bilagshenter-agent (demo-modus fungerer)

### Filer og struktur
```
dashboard/
├── app/
│   ├── (dashboard)/
│   │   ├── customers/
│   │   ├── invoices/
│   │   ├── kostnader/
│   │   └── okonomi/
│   └── api/
│       ├── fiken/
│       ├── customers/
│       └── auth/google/        # OAuth for Gmail
├── agents/
│   └── bilagshenter/
│       ├── index.ts            # Hovedkjørescript
│       ├── agent.ts            # Claude Agents SDK versjon
│       └── tools/
│           ├── gmail-attachments.ts
│           ├── fiken-upload.ts
│           └── document-parser.ts
├── scripts/
│   └── auto-sync.js
└── .env.local                  # API keys (ikke commit)
```

### Environment Variables (.env.local)
```env
# Fiken
FIKEN_API_TOKEN=<token>
FIKEN_COMPANY_SLUG=digitalspor-as

# Anthropic
ANTHROPIC_API_KEY=<key>

# Gmail (delvis satt opp)
GMAIL_CLIENT_ID=409640859566-72j2o4enr1klfsbsbi8mmftan9iokqo3.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=<secret>
GMAIL_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GMAIL_REFRESH_TOKEN=  # Må genereres via OAuth flow
GMAIL_ACCESS_TOKEN=   # Må genereres via OAuth flow
```

---

## 2. Arkitektur-beslutning

### Problem
- Local-to-local setup skalerer ikke til 2 brukere
- Trenger produksjonsmiljø for CRM
- Agenter trenger godkjenningsflyt

### Løsning: Hybrid arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Produksjon)                      │
│                                                             │
│  CRM Dashboard                                              │
│  - Kunder, Fakturaer, Økonomi                              │
│  - Agent-status og godkjenningskø                          │
│  - 2 brukere (deg + kollega)                               │
│                                                             │
│  Database: Supabase                                         │
│  - Kunder, fakturaer, bilag                                │
│  - Agent memory & context                                  │
│  - Approval queue                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ API (Supabase client)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 LOKAL (Claude Code)                         │
│                                                             │
│  Agent Execution                                            │
│  - Bilagshenter, MVA-agent, Skatt-agent                    │
│  - Tunge AI-operasjoner                                    │
│  - Utvikling & debugging                                   │
│  - Pusher forslag til approval queue                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Guardrails & Approval Workflow

### Kritiske handlinger (krever godkjenning)
- Opprette/sende faktura
- Kreditere faktura
- Bokføre bilag over 1000 kr
- MVA-innrapportering
- Utbetalinger

### Approval flow
```
Agent foreslår → Pending i kø → Bruker godkjenner i dashboard → Agent utfører
```

### Database-tabell: `agent_approvals`
```sql
CREATE TABLE agent_approvals (
  id UUID PRIMARY KEY,
  agent_type TEXT NOT NULL,           -- 'bilagshenter', 'mva', etc.
  action_type TEXT NOT NULL,          -- 'upload_purchase', 'send_invoice', etc.
  payload JSONB NOT NULL,             -- Full data for handlingen
  status TEXT DEFAULT 'pending',      -- 'pending', 'approved', 'rejected', 'executed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  error TEXT
);
```

---

## 4. Memory & Context System

### Lagringsnivåer

```
┌─────────────────────────────────────────────────────────────┐
│ Bedriftsnivå                                                │
│ - Kontokoder, kategoriregler                               │
│ - MVA-satser, regnskapsår                                  │
│ - Leverandør → kontokode mapping                           │
├─────────────────────────────────────────────────────────────┤
│ Kundenivå                                                   │
│ - Betalingshistorikk, preferanser                          │
│ - Kommunikasjonslogg                                       │
│ - Avtalte vilkår, rabatter                                 │
├─────────────────────────────────────────────────────────────┤
│ Periodenivå                                                 │
│ - MVA-termin (jan-feb, mar-apr, etc.)                      │
│ - Årsregnskap per år                                       │
├─────────────────────────────────────────────────────────────┤
│ Bilagsnivå                                                  │
│ - Kategoriseringshistorikk (læring)                        │
│ - OCR-korreksjoner                                         │
└─────────────────────────────────────────────────────────────┘
```

### Database-tabell: `agent_memory`
```sql
CREATE TABLE agent_memory (
  id UUID PRIMARY KEY,
  scope TEXT NOT NULL,                -- 'company', 'customer', 'period', 'receipt'
  scope_id TEXT,                      -- customer_id, period_id, etc.
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  confidence FLOAT DEFAULT 1.0,
  learned_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT                         -- 'manual', 'agent_inference', 'user_correction'
);

-- Eksempel: Leverandørmapping
-- scope: 'company', key: 'vendor_mapping', value: {"Domeneshop AS": {"account": "6540", "category": "IT"}}
```

---

## 5. Planlagte Agenter

| Agent | Beskrivelse | Prioritet |
|-------|-------------|-----------|
| Bilagshenter | Henter bilag fra e-post, parser, laster til Fiken | ✅ Ferdig (demo) |
| MVA-agent | Beregner MVA, forbereder termin-rapport | Høy |
| Skatt-agent | Skatteberegning, overskuddsoversikt | Medium |
| Oppfølgings-agent | Purring på ubetalte fakturaer | Medium |
| Fakturerings-agent | Genererer fakturaforslag basert på timer/avtaler | Lav |
| Bank-avstemming | Matcher transaksjoner med bilag | Lav |

---

## 6. Dashboard UI-plan

### Ny sidebar-struktur
```
📊 Dashboard
👥 Kunder
📄 Faktura
💰 Økonomi
   ├── Oversikt
   ├── Kostnader
   └── Utestående
🤖 Agenter              ← NY
   ├── Oversikt
   ├── Godkjenninger    ← Approval queue
   └── Historikk
⚙️ Innstillinger
```

### Agenter-siden
- Statusoversikt for hver agent (idle, running, error)
- Godkjenningskø med approve/reject knapper
- Historikk over utførte handlinger
- Mulighet for å starte agenter manuelt (med confirmation)

---

## 7. Neste steg (prioritert)

### Fase 1: Database & Deploy
1. [ ] Sett opp Supabase prosjekt
2. [ ] Lag database schema (kunder, fakturaer, agent_approvals, agent_memory)
3. [ ] Migrer fra Fiken-only til Supabase + Fiken sync
4. [ ] Deploy til Vercel
5. [ ] Sett opp auth (Supabase Auth for 2 brukere)

### Fase 2: Agenter i Dashboard
1. [ ] Lag Agenter-side med status-oversikt
2. [ ] Implementer approval queue UI
3. [ ] Koble bilagshenter til approval flow
4. [ ] Test end-to-end med ekte Gmail

### Fase 3: Memory & Læring
1. [ ] Implementer agent_memory tabell
2. [ ] Legg til læring i bilagshenter (kategori-forslag)
3. [ ] Dashboard for å se/redigere learned mappings

### Fase 4: Flere agenter
1. [ ] MVA-agent
2. [ ] Oppfølgings-agent
3. [ ] Skatt-agent

---

## 8. Gmail OAuth (uferdig)

**E-postkonto:** `post@digitalspor.no`

For å fullføre Gmail-integrasjon:

1. Gå til [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Velg/opprett prosjekt for DigitalSpor
3. Opprett OAuth 2.0 Client ID (Web application)
4. Legg til redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Aktiver Gmail API i prosjektet
6. Oppdater `.env.local` med ny CLIENT_ID og CLIENT_SECRET
7. Start dev server: `bun run dev`
8. Gå til: `http://localhost:3000/api/auth/google`
9. Logg inn med **post@digitalspor.no**
10. Kopier tokens til `.env.local`

**NB:** Hvis digitalspor.no bruker Google Workspace, må OAuth consent screen konfigureres som "Internal" eller appen må verifiseres av Google.

---

## 9. Teknisk stack

| Komponent | Teknologi |
|-----------|-----------|
| Frontend | Next.js 16, React 19, Flowbite React |
| Styling | Tailwind CSS 4 |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Hosting | Vercel |
| Regnskap | Fiken API |
| E-post | Gmail API |
| AI | Anthropic Claude API |
| Package manager | Bun |

---

## 10. Referanser

- Fiken API: https://api.fiken.no/api/v2/docs/
- Supabase: https://supabase.com/docs
- Flowbite React: https://flowbite-react.com/
- Claude API: https://docs.anthropic.com/

---

*Denne filen oppdateres ved større arkitektur-beslutninger.*
