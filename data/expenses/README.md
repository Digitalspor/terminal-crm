# Kostnader / Utgifter

Denne mappen inneholder alle registrerte kostnader for bedriften (ikke lønn).

## Dataformat

Hver kostnadsfil skal følge dette formatet:

```json
{
  "id": "unik-id",
  "date": "YYYY-MM-DD",
  "description": "Beskrivelse av kostnad",
  "category": "Kategori (valgfri)",
  "amount": 1234,
  "receiptFile": "filnavn.pdf (valgfri)",
  "receiptNumber": "referansenummer (valgfri)",
  "vendor": "Leverandør/butikk",
  "notes": "Notater (valgfri)",
  "created": "ISO timestamp"
}
```

## Kategorier

Foreslåtte kategorier:
- Kontorrekvisita
- Software
- Hosting
- Domener
- Reklame/Markedsføring
- Reise
- Transport
- Møbler/Utstyr
- Telefon/Internett
- Regnskapshjelp
- Forsikring
- Andre kostnader

## Beløp

Beløpene angis i **kroner** (ikke øre som fakturaer).

## Integrasjon med Fiken

For å hente kostnader fra Fiken automatisk, bruk:
```bash
npm run crm fiken:sync-expenses
```

Dette vil synkronisere alle utgifter/bilag fra Fiken til lokale filer.

## Visning i Dashboard

Kostnader vises under **ØKONOMI → KOSTNADER** i dashboardet, gruppert per måned med totalsummer.
