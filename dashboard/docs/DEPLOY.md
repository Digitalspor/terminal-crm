# Deployment Guide

## Arkitektur

Agent CRM bruker en split-deployment arkitektur:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │     Railway     │     │    Supabase     │
│   (Frontend)    │────▶│  (agents-server)│────▶│   (Database)    │
│   Next.js 16    │     │    Node.js      │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                              │
                    Supabase Real-time
```

---

## 1. Frontend (Vercel) ✅

### Status: Live

**URL:** https://agent-crm-ten.vercel.app

### Oppsett

1. Importer fra GitHub: `digitalspor-agency/agent-crm`
2. Framework: Next.js (auto-detected)
3. Root Directory: `/` (default)

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xahsdeloeuunkbrmylue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=https://agent-crm-ten.vercel.app
GMAIL_CLIENT_ID=174871153658-...
GMAIL_CLIENT_SECRET=GOCSPX-...
```

### Build Command

```bash
npm run build
```

---

## 2. agents-server (Railway) 📋

### Status: Ikke deployet

### Hvorfor Railway?

- **Persistent runtime** - ikke serverless, kan kjøre cron jobs
- **Background workers** - polling Gmail hver 5 min
- **Langvarige prosesser** - Claude API-kall kan ta tid
- **Enkel setup** - GitHub-kobling, auto-deploy

### Railway Setup

1. **Opprett prosjekt på [railway.app](https://railway.app)**

2. **Koble GitHub repo**
   - Velg `digitalspor-agency/agent-crm`
   - Root Directory: `agents-server`

3. **Konfigurer build**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

4. **Legg til Environment Variables**
   ```
   SUPABASE_URL=https://xahsdeloeuunkbrmylue.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Fra Supabase Dashboard
   ANTHROPIC_API_KEY=sk-ant-...          # Fra Anthropic Console
   GMAIL_CLIENT_ID=174871153658-...
   GMAIL_CLIENT_SECRET=GOCSPX-...
   ```

5. **Deploy**
   - Railway deployer automatisk ved push til `main`

### Cron Setup (Gmail Polling)

Railway støtter cron via deres UI eller via kode:

```typescript
// agents-server/src/cron/gmail-poller.ts
// Kjører hver 5. minutt
```

Alternativt: Bruk Railway's Cron Job feature i dashboard.

---

## 3. Supabase ✅

### Status: Live

**Project:** xahsdeloeuunkbrmylue

### Viktige tabeller

- `agencies` - Byråer (DigitalSpor, Vodacom)
- `team_members` - Brukere koblet til byrå
- `tasks` - Oppgaver med status-workflow
- `customers` - Kunder per byrå
- `agency_integrations` - Gmail tokens, SSH keys

### RLS Policies

Alle tabeller har Row Level Security basert på `agency_id`.

---

## 4. Feilsøking

### Vercel Build Feiler

**"Supabase client requires URL and key"**
- Sjekk at `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY` er satt i Vercel

**"Module not supported in Edge Runtime"**
- Midleware warnings for Supabase - kan ignoreres (non-blocking)

### Railway Connection Issues

**"Cannot connect to Supabase"**
- Sjekk at `SUPABASE_SERVICE_ROLE_KEY` er korrekt (ikke anon key)

**"ANTHROPIC_API_KEY missing"**
- Legg til API-nøkkel fra https://console.anthropic.com

---

## 5. Neste steg

1. [ ] Deploy agents-server til Railway
2. [ ] Verifiser Gmail polling fungerer i prod
3. [ ] Test full workflow: Email → Task → Plan → Execute
4. [ ] Sett opp Fiken-integrasjon for fakturering
5. [ ] Konfigurer egendefinert domene (valgfritt)

---

*Sist oppdatert: 30. desember 2024*
