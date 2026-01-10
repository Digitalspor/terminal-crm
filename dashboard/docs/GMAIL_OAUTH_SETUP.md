# Gmail OAuth Setup Guide

> Dokumentasjon for Gmail OAuth-integrasjon i Agent CRM

## Oversikt

Gmail OAuth lar Agent 1 (Email Analyzer) hente emails fra byrå-innboksen og automatisk opprette oppgaver.

## Arkitektur

```
Bruker → /settings → "Koble til Gmail"
                          ↓
            /api/auth/gmail (initiate OAuth)
                          ↓
            Google OAuth Consent Screen
                          ↓
            /api/auth/gmail/callback (receive tokens)
                          ↓
            agency_integrations table (store tokens)
                          ↓
            Agent 1 polls Gmail every 5 min
```

## Google Cloud Console Setup

### 1. Opprett prosjekt
- Gå til https://console.cloud.google.com
- Opprett nytt prosjekt (f.eks. "agent-crm")

### 2. Aktiver Gmail API
- **APIs & Services** → **Library**
- Søk "Gmail API" → **Enable**

### 3. OAuth Consent Screen
- **APIs & Services** → **OAuth consent screen**
- Velg **Internal** (for Google Workspace) eller **External**
- Fyll ut app-info

### 4. Opprett OAuth Credentials
- **APIs & Services** → **Credentials**
- **+ Create Credentials** → **OAuth client ID**
- Type: **Web application**
- Navn: `agent-crm-oauth`

### 5. Authorized Redirect URIs
Legg til alle miljøer:
```
http://localhost:3000/api/auth/gmail/callback
http://localhost:3001/api/auth/gmail/callback
http://localhost:3004/api/auth/gmail/callback
https://agent-crm-mauve.vercel.app/api/auth/gmail/callback
```

### 6. Kopier credentials
- **Client ID**: `xxx.apps.googleusercontent.com`
- **Client Secret**: `xxx`

## Environment Variables

### .env.local (lokal utvikling)
```env
GMAIL_CLIENT_ID=174871153658-xxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxx
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

### Vercel (produksjon)
Legg til i **Settings** → **Environment Variables**:
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL=https://agent-crm-mauve.vercel.app`

## Database

### agency_integrations table
```sql
CREATE TABLE agency_integrations (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  provider TEXT,              -- 'gmail'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  account_email TEXT,         -- 'post@digitalspor.no'
  is_active BOOLEAN
);
```

### RLS Policies
```sql
-- SELECT: Brukere kan se integrasjoner for sitt byrå
CREATE POLICY "Users can view integrations" ON agency_integrations
  FOR SELECT USING (agency_id = get_user_agency_id());

-- INSERT: Brukere kan legge til integrasjoner
CREATE POLICY "Users can insert integrations" ON agency_integrations
  FOR INSERT WITH CHECK (agency_id = get_user_agency_id());

-- UPDATE: Brukere kan oppdatere integrasjoner
CREATE POLICY "Users can update integrations" ON agency_integrations
  FOR UPDATE USING (agency_id = get_user_agency_id());
```

## API Routes

### GET /api/auth/gmail
Initierer OAuth-flow:
1. Sjekker at bruker er logget inn
2. Genererer Google OAuth URL med scopes
3. Redirecter til Google

### GET /api/auth/gmail/callback
Mottar OAuth tokens:
1. Verifiserer state (agency_id)
2. Bytter authorization code mot tokens
3. Henter brukerens Gmail-adresse
4. Lagrer tokens i agency_integrations
5. Oppdaterer agencies.gmail_email
6. Redirecter til /settings med suksessmelding

## Scopes

```typescript
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",   // Les emails
  "https://www.googleapis.com/auth/gmail.send",       // Send emails
  "https://www.googleapis.com/auth/gmail.modify",     // Marker som lest
];
```

## Troubleshooting

### "OAuth client was not found" (401 invalid_client)
- Sjekk at GMAIL_CLIENT_ID er riktig i .env.local
- Restart dev-server etter endringer

### "redirect_uri_mismatch" (400)
- Legg til redirect URI i Google Cloud Console
- Vent 2-5 minutter for Google å oppdatere
- Sjekk at NEXT_PUBLIC_APP_URL matcher porten appen kjører på

### Tokens lagres ikke (RLS-feil)
- Sjekk at INSERT/UPDATE policies finnes på agency_integrations
- Bruker må ha team_member-kobling til byrået

### Port-problemer
Next.js bytter port hvis 3000 er opptatt. Løsninger:
```bash
# Drep prosesser på porter
lsof -ti:3000,3001,3004 | xargs kill -9

# Start på spesifikk port
PORT=3004 npm run dev
```

## Testing

1. Start dev-server: `npm run dev`
2. Logg inn på `/login`
3. Gå til `/settings`
4. Klikk "Koble til Gmail"
5. Godkjenn tilgang i Google
6. Verifiser "Tilkoblet" status

## Agent 1 Integration

agents-server bruker tokens fra agency_integrations:

```typescript
// agents-server/src/tools/gmail.ts
export async function getGmailClient(agencyId: string) {
  const { data: integration } = await supabase
    .from("agency_integrations")
    .select("*")
    .eq("agency_id", agencyId)
    .eq("provider", "gmail")
    .eq("is_active", true)
    .single();
  
  // Auto-refresh tokens hvis expired
  // Returnerer gmail client
}
```

## Neste steg

1. **Test Agent 1**: `cd agents-server && npm run dev`
2. **Send test-email** til post@digitalspor.no
3. **Verifiser** at oppgave opprettes automatisk
