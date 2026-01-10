# Changelog

All notable changes to Agent CRM will be documented in this file.

## [0.3.0] - 2024-12-31

### 🤖 Serverless AI Agents

Full workflow nå fungerer uten agents-server deployment:

- **Task Planner (Agent 2)** - Serverless via `/api/tasks/[id]/plan`
  - Genererer detaljerte utførelsesplaner med WP-CLI kommandoer
  - Estimerer tid og foreslår timepris
  - Inkluderer risikoer og suksesskriterier
  - Logger til `agent_logs` tabell

- **Task Executor (Agent 3)** - Serverless via `/api/tasks/[id]/execute`
  - Simulert modus for demo (ekte SSH krever Railway)
  - Oppdaterer task status: approved → in_progress → completed
  - Lagrer execution log med steg-resultater

- **Plan Approval Flow** - Komplett godkjenningsflyt
  - "Generer plan med AI" knapp på nye oppgaver
  - Plan-visning med steg, kommandoer og estimater
  - "Godkjenn og utfør" / "Avvis" knapper
  - Automatisk utførelse etter godkjenning

### 📊 Agent Monitoring System

- **Database**: `agent_logs` og `agent_alerts` tabeller
- **Dashboard**: `/logs` side med agent-statistikk
- Logging av alle agent-kjøringer med tokens, status og feilmeldinger

### 🎨 UI Forbedringer

- Responsiv plan-godkjenning card (mobil-vennlig)
- Proper dark mode for kodeblokker
- Status badges for steg-resultater (Fullført, Simulert, Feilet, Hoppet over)
- Forbedret execution log visning med per-steg output

### 🔧 Teknisk

- `@anthropic-ai/sdk` installert i frontend
- `ANTHROPIC_API_KEY` konfigurert i Vercel
- API routes bruker intern Next.js routing (ikke ekstern agents-server)
- Fikset React rendering error for plan steps som objekter

### 📁 Nye Filer

- `app/api/tasks/[id]/plan/route.ts` - Task Planner API
- `app/api/tasks/[id]/execute/route.ts` - Task Executor API
- `app/api/tasks/[id]/approve/route.ts` - Plan godkjenning
- `app/(dashboard)/tasks/[id]/generate-plan-button.tsx`
- `app/(dashboard)/tasks/[id]/approve-button.tsx`
- `app/(dashboard)/logs/page.tsx` - Agent logs dashboard
- `supabase/migrations/*_agent_logs.sql`

### 📋 Status

| Funksjon | Status |
|----------|--------|
| Generer plan med AI | ✅ Fungerer |
| Godkjenn og utfør | ✅ Fungerer (simulert) |
| Agent Logs | ✅ Fungerer |
| SSH-utførelse | ⏳ Krever Railway |
| Gmail polling | ⏳ Krever Railway |

---

## [0.2.0] - 2024-12-30

### 🚀 Deployment

- **Frontend deployed to Vercel** at https://agent-crm-ten.vercel.app
- Next.js upgraded from 15.3.3 → **16.1.1** (security fix for CVE-2025-66478)
- Fixed login page prerendering issue that blocked Vercel builds

### 🔧 Fixes

- **Login page SSR fix**: Added `app/login/layout.tsx` with `dynamic = 'force-dynamic'` to prevent prerendering
- **Login page client-side Supabase**: Wrapped `createClient()` in `useMemo` with `typeof window` check
- **TypeScript config**: Excluded `agents-server` from Next.js build to prevent compilation conflicts
- **Dependency conflicts**: Added `.npmrc` with `legacy-peer-deps=true` for Tailwind v4 compatibility
- **RLS policies**: Added INSERT/UPDATE policies for `agency_integrations` table
- **googleapis**: Installed in frontend for Gmail OAuth API routes

### 🗄️ Database Migrations

- `20251230193000_fix_integrations_rls.sql` - RLS policies for agency integrations

### 📦 Dependencies

- `next`: 15.3.3 → 16.1.1
- `googleapis`: Added to frontend

### ⚙️ Environment Variables (Vercel)

Required for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (set to Vercel URL)
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`

### 📋 Known Issues

- `middleware.ts` shows deprecation warning in Next.js 16 (should migrate to "proxy" convention)
- Edge Runtime warnings for Supabase realtime (non-blocking)

---

## [0.1.0] - 2024-12-29

### Initial Release

- Dashboard UI with Flowbite React
- Supabase authentication with RLS
- Task management system (CRUD)
- Customer management
- Gmail integration for email → task conversion
- 5 AI agents implemented:
  1. Email Analyzer - Parses incoming emails
  2. Task Planner - Generates execution plans
  3. Task Executor - Runs WP-CLI/API commands
  4. Client Responder - Drafts response emails
  5. Invoice Drafter - Creates invoice drafts

---

*See `plan/ROADMAP.md` for future features*
