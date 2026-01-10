# Agent CRM

> AI-drevet Agency Operations Platform

## Quick Context

- **Stack**: Next.js 16.1.1, React 19, Tailwind v4, Flowbite React, Supabase
- **Brukere**: 2 (DigitalSpor + Vodacom)
- **Workflow**: Email → Oppgave → Plan (godkjennes) → Utførelse → Kundesvar → Faktura
- **Detaljert plan**: Se `plan/PLAN.md`

## 🌐 Deployment Status

| Komponent | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | https://agent-crm-ten.vercel.app | ✅ Live |
| agents-server | Railway | TBD | 📋 Planlagt |
| Database | Supabase | xahsdeloeuunkbrmylue.supabase.co | ✅ Live |

## Commands

```bash
# Frontend build
npm run build

# Frontend development
npm run dev

# Agent server (separat terminal)
cd agents-server && npm run dev

# Agent server build
cd agents-server && npm run build

# Database
supabase start
supabase db reset

# Typecheck alt
npm run build && cd agents-server && npm run typecheck
```

## Prosjektstruktur

```
agent-crm/
├── app/                    # Next.js frontend
│   ├── (dashboard)/        # Protected routes
│   ├── api/                # API routes
│   └── lib/                # Utilities
├── agents-server/          # Agent runtime (→ Railway)
│   └── src/agents/         # 5 agent-definisjoner
├── supabase/migrations/    # Database schema
├── plan/                   # Prosjektplan og roadmap
├── ui/                     # Flowbite Pro kit (referanse)
├── CHANGELOG.md            # Endringslogg
└── docs/DEPLOY.md          # Deployment-guide
```

## Agenter (5 implementert + 1 planlagt)

| Agent            | Trigger               | Godkjenning        | Status |
| ---------------- | --------------------- | ------------------ | ------ |
| Email Analyzer   | Gmail polling (5 min) | Nei                | ✅     |
| Task Planner     | Ny oppgave            | **JA**             | ✅     |
| Task Executor    | Plan godkjent         | Nei (pre-godkjent) | ✅     |
| Client Responder | Oppgave fullført      | Nei                | ✅     |
| Invoice Drafter  | Timer logget          | Manuell sending    | ✅     |
| Front-end Designer | Nytt prosjekt       | Delvis             | 📋     |

> Se `plan/ROADMAP.md` for Agent 6 og fremtidige funksjoner

### Agent 6: Front-end Designer (Planlagt)

Automatisert design system-ekstraksjon og nettside-generering:

- **6A: Design Token Extractor** - Playwright + Claude Vision
- **6B: Template Generator** - React + Tailwind templates
- **6C: Content Generator** - AI-generert innhold
- **6D: Validation Agent** - Screenshot-sammenligning

**Stack:** Playwright, Claude API, React, Tailwind v4

## Kritiske Patterns

### Next.js 16 - Await params

```typescript
const { id } = await params;
const search = await searchParams;
```

### Supabase RLS

```typescript
// Alle queries filtreres automatisk på agency_id
const { data } = await supabase.from("tasks").select("*");
```

### SSH til Kinsta

```typescript
// Hver bruker har egen SSH-nøkkel
// Sites: user@site.kinsta.cloud
ssh user@site.kinsta.cloud "cd /www/site/public && wp plugin update --all"
```

## Environment Variables

### Frontend (Vercel)

| Variabel | Beskrivelse |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | Production URL (https://agent-crm-ten.vercel.app) |
| `GMAIL_CLIENT_ID` | Google OAuth client ID |
| `GMAIL_CLIENT_SECRET` | Google OAuth client secret |

### agents-server (Railway)

| Variabel | Beskrivelse |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Claude API key for AI agents |
| `GMAIL_CLIENT_ID` | Google OAuth client ID |
| `GMAIL_CLIENT_SECRET` | Google OAuth client secret |

## Integrasjoner

| Tjeneste   | Status          | Brukes til              |
| ---------- | --------------- | ----------------------- |
| Gmail      | ✅ Koblet til   | Email → Oppgave         |
| Kinsta SSH | ✅ Klar         | WP-CLI utførelse        |
| Fiken      | 🔄 Settes opp   | Fakturaer (DigitalSpor) |
| Tripletex  | ⏳ Venter       | Timer/faktura (Vodacom) |

## Implementeringsfaser

1. **Fundament** - UI, database, auth ✅
2. **Oppgavesystem** - CRUD, status-workflow ✅
3. **Gmail** - Email → Oppgave (Agent 1) ✅
4. **Task Planner** - AI-generert plan (Agent 2) ✅
5. **Task Executor** - WP-CLI/API (Agent 3) ✅
6. **Client Responder** - Svar-email (Agent 4) ✅
7. **Fakturering** - Kladder i Fiken (Agent 5) ✅
8. **Deploy Frontend** - Vercel ✅
9. **Deploy Agents** - Railway 📋 Neste steg

## Godkjenningspunkter

⚠️ **Plan ALLTID godkjennes** før utførelse
⚠️ **Faktura ALDRI sendes** automatisk - kun kladd

## UI Kit

Referanse-komponenter i `ui/flowbite-pro-nextjs-admin-dashboard-main/`

- Dashboard layouts
- Sidebar/Navbar
- Tables, Forms, Cards
- Charts (ApexCharts)
