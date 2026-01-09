# Git Workflow for CRM Terminal

Dette dokumentet beskriver hvordan dere jobber sammen på dette CRM-systemet via Git.

## 🎯 Overordnet Konsept

- **Git er "source of truth"** - All data lagres som filer i repoet
- **Automatisk sync** - Claude Code committer og pusher etter hver endring
- **Pull-basert sync** - Den andre brukeren får endringer ved `git pull`
- **To brukere** - Hver bruker har sin egen Git-konto og Claude Code-konto

## 🔄 Daglig Arbeidsflyt

### 1. Start dagen

```bash
cd crm-terminal
git pull --rebase
```

**Alltid** pull før du starter å jobbe!

### 2. Jobb med CRM-en

Bruk Claude Code for å:
- Legge til kunder
- Opprette fakturaer
- Logge timer
- Legge til notater og påminnelser

**Claude Code vil automatisk:**
- Committe endringer med beskrivende meldinger
- Pushe til GitHub
- Håndtere konflikter hvis nødvendig

### 3. Kollegaen får endringene

Din kollega kjører:

```bash
git pull --rebase
```

Og får alle dine endringer lokalt.

### 4. Kontinuerlig sync

**Best practice:**
- Pull hver time hvis du jobber aktivt
- Pull før du starter en ny oppgave
- Pull etter lunsj / pauser

## 🚨 Håndtering av Merge-konflikter

Konflikter oppstår når begge endrer samme fil samtidig.

### Scenario: Begge redigerer samme kunde

1. Du endrer "Acme Corp" og pusher
2. Kollega endrer også "Acme Corp" og prøver å pushe
3. Push feiler med konflikt

### Løsning:

```bash
# 1. Pull med rebase
git pull --rebase

# 2. Git viser hvilke filer som har konflikt
# Åpne filen og se etter:
<<<<<<< HEAD
{din versjon}
=======
{kollega sin versjon}
>>>>>>> origin/main

# 3. Rediger filen og velg riktig versjon
# For JSON-filer: velg nyeste basert på "updated" timestamp
# For markdown-logger: behold begge entries

# 4. Mark resolved
git add .
git rebase --continue

# 5. Push igjen
git push
```

### Tips for å unngå konflikter:

1. **Kommuniser** - Si fra hvis du jobber på en spesifikk kunde
2. **Pull ofte** - Færre konflikter hvis du er oppdatert
3. **Spesialiser** - Fordel kunder/prosjekter mellom dere
4. **Bruk notater** - Hver bruker har egne notater per kunde (ingen konflikt)

## 📁 Filstruktur og Konflikter

### Lav konflikt-risiko:

```
/data/customers/<kunde-id>.json      - Sjelden konflikt (ulike kunder)
/data/projects/<project-id>.json     - Sjelden konflikt (ulike prosjekter)
/data/invoices/<invoice-id>.json     - Sjelden konflikt (unik ID)
/logs/YYYY-MM-DD.md                  - Sjelden konflikt (ulike dager)
/data/notes/<kunde-id>/<user-id>.md  - INGEN konflikt (bruker-spesifikk!)
/data/reminders/<user-id>-*.json     - INGEN konflikt (bruker-spesifikk!)
/data/calendar/<user-id>-*.json      - INGEN konflikt (bruker-spesifikk!)
```

### Høy konflikt-risiko:

- Samme kunde på samme tidspunkt
- Samme dagslogg samtidig
- Samme faktura samtidig

**Løsning:** Kommuniser eller bruk bruker-spesifikke notater.

## 🤖 Auto-Commit Meldinger

Claude Code bruker følgende format:

```
<type>: <kort beskrivelse>
```

**Typer:**

- `customer:` - Kunde-endringer
- `invoice:` - Faktura-endringer
- `project:` - Prosjekt-endringer
- `log:` - Logger og tidsføring
- `note:` - Notater på kunder
- `reminder:` - Påminnelser
- `calendar:` - Kalender-events
- `sync:` - Generell synkronisering
- `feat:` - Ny funksjonalitet (kode)
- `fix:` - Bugfix (kode)

**Eksempler:**

```
customer: Legg til ny kunde - Acme Corp
invoice: Opprett faktura #2024-001 for Acme Corp
log: Logg 3 timer på Acme redesign
note: Legg til møtenotat for Acme Corp
reminder: Legg til påminnelse - Ring kunde neste uke
calendar: Legg til møte med Acme Corp 2024-02-15
sync: Auto-sync lokale endringer
```

## 🔧 Nyttige Git-kommandoer

```bash
# Se status
git status

# Se commit-historikk
git log --oneline -10

# Se hvem som endret en fil sist
git log -1 data/customers/acme-corp.json

# Se diff for en fil
git diff data/customers/acme-corp.json

# Undo lokale endringer (før commit)
git checkout -- data/customers/acme-corp.json

# Se remote endringer før pull
git fetch
git log HEAD..origin/main --oneline
```

## 📊 Bruker-spesifikk Data

Siden dere er to brukere, er noe data **bruker-spesifikk**:

### Notater på kunder

```
/data/notes/acme-corp/
  ├── andre.md          ← Dine notater
  └── kollega.md        ← Kollegaens notater
```

Begge kan ha notater på samme kunde uten konflikt!

### Påminnelser

```
/data/reminders/
  ├── andre-reminders.json      ← Dine påminnelser
  └── kollega-reminders.json    ← Kollegaens påminnelser
```

### Kalender

```
/data/calendar/
  ├── andre-calendar.json       ← Din kalender
  └── kollega-calendar.json     ← Kollegaens kalender
```

## 🌐 Remote Repository Setup

### Første gang (én gang per bruker):

```bash
# 1. Klon repoet
git clone https://github.com/ditt-byrå/crm-terminal.git
cd crm-terminal

# 2. Installer dependencies
npm install

# 3. Konfigurer .env
cp .env.example .env
# Rediger .env med Fiken API tokens, etc.

# 4. Test
npm run crm kunder
```

### Push til GitHub (første gang):

```bash
# Hvis repoet ikke har remote ennå
git remote add origin https://github.com/ditt-byrå/crm-terminal.git
git branch -M main
git push -u origin main
```

## 🎛️ Automatisering (Valgfritt)

### Auto-pull med Git Hooks

Sett opp en cron job eller hook for å auto-pulle hver time:

```bash
# .git/hooks/post-commit (kjører etter hver commit)
#!/bin/bash
git pull --rebase --autostash
```

### Git Aliases

Legg til i `~/.gitconfig`:

```
[alias]
  sync = !git pull --rebase && git push
  st = status -sb
  lg = log --oneline --graph --decorate -10
```

Bruk med: `git sync`, `git st`, `git lg`

## ⚠️ Viktige Regler

1. **Aldri force push** til `main` uten å snakke sammen
2. **Alltid pull før nye endringer**
3. **Sjekk git status** hvis noe ser rart ut
4. **Kommuniser** hvis du jobber på noe viktig
5. **Backup** - GitHub er backupen, men ta snapshot hvis du er nervøs

## 🚀 Fremtidige Forbedringer

### Hvis Git blir for tungvint:

1. **Legg til database** (PostgreSQL / SQLite)
   - Behold Git for kode
   - Database for data
   - API-lag for synkronisering

2. **Legg til WebSocket-server**
   - Sanntids-notifikasjoner
   - Live updates mellom brukere

3. **Konflikt-resolving UI**
   - Visuell diff-viewer
   - Enklere merging

Men for nå: **Git er enkelt, robust og fungerer!**

## 📞 Support

Hvis noe går galt:

1. Sjekk `git status`
2. Les feilmeldingen nøye
3. Spør Claude Code om hjelp
4. Google feilmeldingen
5. Spør kollegaen

**Husk:** Git er veldig vanskelig å ødelegge permanent. Det meste kan reverseres!
