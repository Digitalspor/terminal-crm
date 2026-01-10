# CRM Terminal - Claude Code Instructions

Dette er et CRM-system med Flowbite dashboard og Claude Code som interface.

## Arkitektur

```
┌─────────────────────────────────────────────────────────┐
│  Flowbite Dashboard (localhost:3333)                    │
│  - Visuell oversikt                                     │
│  - Kunder, fakturaer, forfalte                          │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │ leser fra
                         ▼
┌─────────────────────────────────────────────────────────┐
│  SQLite Database (data/crm.db)                          │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │ endres via
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Claude Code (terminal)                                 │
│  - Naturlig språk-kommandoer                            │
│  - Fiken-sync                                           │
│  - Avanserte operasjoner                                │
└─────────────────────────────────────────────────────────┘
```

## Starte dashboard

```bash
cd dashboard
npm install   # Første gang
npm run dev   # Starter på localhost:3333
```

## Datastruktur

### Kunder
- JSON: `data/customers/*.json`
- Database: `data/crm.db` → `customers`

### Fakturaer
- JSON: `data/invoices/*.json`
- Database: `data/crm.db` → `invoices`

## Vanlige Claude Code-kommandoer

### Se data
```
"Vis alle kunder"
"Vis forfalte fakturaer"
"Hvor mye skylder [kunde]?"
"Hvem har høyest omsetning?"
```

### Synce med Fiken
```bash
npm run crm fiken:sync-customers
npm run crm fiken:sync-invoices
```

### Database-spørringer
```bash
# Forfalte fakturaer
sqlite3 data/crm.db "SELECT i.invoice_number, c.name, i.total/100 as kr, i.due_date FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.status <> 'paid' AND i.due_date < date('now') ORDER BY i.total DESC"

# Omsetning per kunde
sqlite3 data/crm.db "SELECT c.name, SUM(i.total)/100 as kr FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.status = 'paid' GROUP BY c.id ORDER BY kr DESC LIMIT 10"

# Totalt utestående
sqlite3 data/crm.db "SELECT SUM(total)/100 as kr FROM invoices WHERE status = 'sent'"
```

## Workflow for to personer

```bash
# Person 1
git pull                    # Hent siste endringer
npm run dev --prefix dashboard  # Start dashboard
claude                      # Gjør endringer via Claude
git add . && git commit -m "Endringer" && git push

# Person 2
git pull                    # Hent endringer fra Person 1
npm run dev --prefix dashboard  # Se oppdatert dashboard
```

## Viktig info

- Alle beløp er i øre (divider med 100 for kroner)
- Datoer er ISO-format (YYYY-MM-DD)
- Dashboard oppdateres når du refresher siden
- Fiken API-nøkler er i `.env` (ikke commit denne!)

## Fremtidige utvidelser

- [ ] Domener/plattformer per kunde
- [ ] Time tracking
- [ ] GitHub-integrasjon per kunde
- [ ] Automatisk fakturering
