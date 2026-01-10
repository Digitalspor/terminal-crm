# Bilagshenter Agent

AI-agent som automatisk henter og behandler bilag fra e-post og leverandørportaler.

## Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Bilagshenter Agent                        │
│                  (Claude Agents SDK)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  E-post      │  │  Leverandør  │  │  Manuell     │       │
│  │  (Gmail)     │  │  Portaler    │  │  Opplasting  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └────────────┬────┴─────────────────┘                │
│                      ▼                                       │
│         ┌────────────────────────┐                          │
│         │   Dokument Parser      │                          │
│         │   (Claude Vision)      │                          │
│         └────────────┬───────────┘                          │
│                      ▼                                       │
│         ┌────────────────────────┐                          │
│         │   Kategorisering       │                          │
│         │   & Validering         │                          │
│         └────────────┬───────────┘                          │
│                      ▼                                       │
│         ┌────────────────────────┐                          │
│         │   Fiken API            │                          │
│         │   (Opplasting)         │                          │
│         └────────────────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Verktøy (Tools)

### 1. `fetch_emails`
Henter e-poster med vedlegg fra Gmail
- Filtrerer på: faktura, kvittering, bilag
- Returnerer: avsender, emne, dato, vedlegg

### 2. `parse_document`
Parser PDF/bilde med Claude Vision
- Ekstraherer: leverandør, beløp, MVA, dato, kontonr
- Returnerer strukturert data

### 3. `categorize_expense`
Kategoriserer kostnad basert på innhold
- Matcher mot Fiken kontokoder
- Foreslår kategori

### 4. `upload_to_fiken`
Laster opp bilag til Fiken
- Oppretter kjøp/utgift
- Knytter til leverandør
- Setter kontokode

### 5. `mark_email_processed`
Markerer e-post som behandlet
- Legger til label
- Arkiverer

## Flyt

1. Agent kjører på schedule (f.eks. hver time)
2. Henter nye e-poster med vedlegg
3. For hver e-post:
   - Parser vedlegg med Claude Vision
   - Kategoriserer kostnad
   - Validerer data (beløp, MVA, dato)
   - Laster opp til Fiken
   - Markerer som behandlet
4. Rapporterer resultat

## Konfigurasjon

```typescript
{
  email: {
    provider: "gmail",
    filters: ["from:faktura@", "from:invoice@", "subject:kvittering"],
    processedLabel: "Bilag/Behandlet"
  },
  fiken: {
    companySlug: "digitalspor-as",
    defaultAccount: "6900" // Annen driftskostnad
  },
  schedule: "0 * * * *" // Hver time
}
```

## Eksempel kjøring

```
[10:00] Bilagshenter startet
[10:00] Fant 3 nye e-poster med vedlegg
[10:01] Behandler: Faktura fra Domeneshop AS
        → Leverandør: Domeneshop AS
        → Beløp: 199 kr (inkl. MVA 39.80)
        → Kategori: 6540 - Programvare
        → Status: Lastet opp til Fiken ✓
[10:02] Behandler: Kvittering Elkjøp
        → Leverandør: Elkjøp Norge AS
        → Beløp: 2499 kr (inkl. MVA 499.80)
        → Kategori: 6500 - Verktøy og utstyr
        → Status: Lastet opp til Fiken ✓
[10:03] Ferdig - 3/3 bilag behandlet
```
