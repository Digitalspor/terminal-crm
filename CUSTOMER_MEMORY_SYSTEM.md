# Customer Memory & Context System

## 🧠 Konsept

Hvert kunde har en **memory** (JSON) og **context** (Markdown) fil som lagres i Git.
Dette gir:
- ✅ Delt kunnskap mellom begge brukere
- ✅ Kontinuerlig læring fra hver interaksjon
- ✅ Full historikk via Git
- ✅ AI kan lære og forbedre kommunikasjon

## 📁 Struktur

```
data/
├── memory/                       # Strukturert data
│   ├── acme-corp-memory.json
│   ├── beta-as-memory.json
│   └── ...
└── context/                      # Naturlig språk kontekst
    ├── acme-corp-context.md
    ├── beta-as-context.md
    └── ...
```

## 📊 Memory Format (JSON)

`data/memory/<customer-id>-memory.json`:

```json
{
  "customerId": "acme-corp",
  "interactions": [
    {
      "date": "2024-01-09T10:30:00Z",
      "type": "email",
      "summary": "Kunde ønsker møte om fase 2",
      "sentiment": "positive",
      "by": "andre",
      "topics": ["design", "expansion", "budget"]
    },
    {
      "date": "2024-01-08T14:00:00Z",
      "type": "meeting",
      "summary": "Gjennomgang av redesign progress",
      "sentiment": "very-positive",
      "by": "kollega",
      "topics": ["progress", "feedback", "timeline"]
    }
  ],
  "preferences": {
    "communicationChannel": "email",
    "responseTime": "same-day",
    "detailLevel": "high",
    "meetingFrequency": "biweekly",
    "contactPerson": "John Doe"
  },
  "businessContext": {
    "industry": "e-commerce",
    "companySize": "50-100 employees",
    "techStack": ["React", "Node.js", "PostgreSQL"],
    "budget": "medium-high",
    "decisionMakers": ["John Doe (CEO)", "Jane Smith (CTO)"]
  },
  "projectHistory": [
    {
      "projectId": "acme-redesign",
      "status": "in-progress",
      "satisfaction": "high",
      "challenges": ["tight timeline", "scope creep"],
      "wins": ["excellent communication", "quality work"]
    }
  ],
  "relationshipMetrics": {
    "totalInteractions": 12,
    "avgSentiment": 0.85,
    "responseRate": 0.95,
    "lifetimeValue": 420000,
    "healthScore": 90,
    "churnRisk": "low"
  },
  "keyInsights": [
    "Very detail-oriented - loves status updates",
    "Prefers to communicate via email over calls",
    "Quick to make decisions but wants thorough documentation",
    "High-value customer with expansion potential"
  ],
  "upcomingOpportunities": [
    {
      "description": "E-commerce platform expansion",
      "estimatedValue": 500000,
      "probability": 0.7,
      "timeline": "Q2 2025"
    }
  ],
  "tags": ["high-value", "e-commerce", "design-focused", "expansion-ready"],
  "lastUpdated": "2024-01-09T10:30:00Z",
  "updatedBy": "andre"
}
```

## 📝 Context Format (Markdown)

`data/context/<customer-id>-context.md`:

```markdown
# Acme Corporation - AI Context & Learnings

## 👤 Om Kunden

Acme Corporation er et e-commerce selskap med 50-100 ansatte. De er i vekst og har høyt fokus på brukervennlighet og moderne design.

### Nøkkelpersoner
- **John Doe (CEO)**: Beslutter, veldig involvert i design-prosessen
- **Jane Smith (CTO)**: Teknisk kontaktperson, opptatt av performance

## 🎯 Hva de verdsetter

1. **Kommunikasjon**: De ønsker hyppige, detaljerte statusoppdateringer
2. **Kvalitet**: Villige til å betale mer for kvalitetsarbeid
3. **Design**: Veldig designbevisste, ønsker moderne, clean design
4. **Mobilfokus**: 70% av trafikken kommer fra mobil

## 💬 Kommunikasjonsstil

- **Preferanse**: E-post > Møter > Telefon
- **Responstid**: Svarer vanligvis innen 2-4 timer
- **Tone**: Profesjonell men vennlig, bruker lite tech-jargon
- **Møtefrekvens**: Hver 2. uke, helst tirsdager kl 10:00

## 🚀 Prosjekthistorikk & Læring

### Website Redesign (pågående)
- **Start**: 15. januar 2024
- **Status**: På track, 60% ferdig
- **Feedback**: Veldig fornøyde så langt
- **Challenges**:
  - Scope creep - vil ha flere features enn planlagt
  - Tight timeline pga. launch-dato
- **Wins**:
  - Excellent samarbeid
  - Rask feedback loop
  - Høy kvalitet på arbeidet

## 💡 Key Insights (Lært over tid)

1. **Designpreferanser**:
   - Liker minimalistisk design
   - Foretrekker lyse farger (hvit/grå/blå)
   - Vil ha mye whitespace
   - Bruker Roboto font family

2. **Arbeidsstil**:
   - Setter pris på proaktive forslag
   - Liker når vi tenker på brukervennlighet
   - Vil se wireframes før full design
   - Ønsker to design-iterasjoner før godkjenning

3. **Budget**:
   - Fleksibel med budsjett hvis det gir verdi
   - Vil ha transparent timeføring
   - Betaler raskt (alltid innen 10 dager)

4. **Fremtidige muligheter**:
   - Har nevnt e-commerce platform expansion flere ganger
   - Kan bli et 500k+ prosjekt i Q2 2025
   - Trenger SEO-optimalisering (mentioned 3x)

## ⚠️  Red Flags å unngå

- Ikke bruk tech-jargon uten forklaring
- Ikke overbook meetings - de er opptatte
- Ikke anta ting - spør heller
- Ikke miss deadlines - de er strenge på tidslinjer

## 🎯 Neste steg

- [ ] Følg opp på fase 2-diskusjonen
- [ ] Send utkast til SEO-strategi (de spurt om dette)
- [ ] Book møte om e-commerce expansion (Q2 timing)
- [ ] Send faktura for fase 1 (deadline 15. januar)

## 📈 Relationship Evolution

### Januar 2024
- Startet som ny kunde, litt forsiktige
- Etter 2 uker: Bygget sterk tillit
- Etter 1 måned: Snakker om langsiktig partnerskap

### Nåværende Status (januar 2026)
- High-value kunde (420k lifetime value)
- Excellent relationship (health score: 90/100)
- Expansion ready - stor mulighet for Q2

## 🤖 AI Notes (Auto-generated insights)

*Disse oppdateres automatisk av AI agents basert på interaksjoner:*

- Sentiment trend: ↗️ (økende positivitet)
- Communication pattern: Regular, responsive, professional
- Upsell opportunity: HIGH (e-commerce expansion)
- Churn risk: LOW (very satisfied)
- Recommended action: Schedule Q2 strategy meeting

---

**Sist oppdatert**: 9. januar 2026 av Andre
**Neste review**: 23. januar 2026
```

## 🔄 Hvordan Memory Oppdateres

### Automatisk (via AI Agents)

Når en interaksjon skjer (e-post, møte, etc.):

1. **Agent kjører** (f.eks. email-processor)
2. **Agent leser memory-fil**
3. **Agent oppdaterer memory** med ny interaksjon
4. **Agent oppdaterer context** med nye innsikter
5. **Commit og push** med melding: `memory: Oppdater Acme context etter e-post`

### Manuelt (via Claude Code)

```
User: "Jeg hadde et godt møte med Acme i dag, de er veldig fornøyde"

Claude: *Leser data/memory/acme-corp-memory.json*
Claude: *Legger til ny interaksjon*
Claude: *Oppdaterer sentiment og health score*
Claude: *Oppdaterer data/context/acme-corp-context.md*
Claude: *Committer og pusher*
```

## 💡 Bruk av Memory i Agents

Når en agent skal generere en e-post eller tilbud:

```markdown
# Email Drafter Agent

## Prosess

1. **Les kunde-data**: data/customers/<kunde-id>.json
2. **Les memory**: data/memory/<kunde-id>-memory.json
3. **Les context**: data/context/<kunde-id>-context.md
4. **Bruk innsikter**:
   - Kommunikasjonsstil fra preferences
   - Tone fra context
   - Tidligere interaksjoner fra interactions
5. **Draft e-post** tilpasset kunden
6. **Lagre draft**: data/emails/<kunde-id>-<date>.md
7. **Oppdater memory** med ny interaksjon (draft)
8. **Commit og push**
```

**Resultat**: E-posten er personalisert basert på all tidligere læring!

## 🤝 Delt Læring Mellom Brukere

### Scenario:

**Andre** har et møte med Acme:
1. Etter møtet ber han Claude om: "Oppdater Acme memory med dagens møte"
2. Claude oppdaterer memory og context
3. Claude committer og pusher

**Kollegaen** skal sende e-post til Acme:
1. Kjører først: `git pull`
2. Ber Claude: "Draft e-post til Acme om prosjekt-status"
3. Claude leser oppdatert memory (inkludert Andres møte-notater)
4. Claude draftter e-post som refererer til møtet
5. **Sømløst samarbeid!**

## 📊 Memory Analytics

Agents kan analysere memory på tvers av kunder:

```
User: "Hvilke kunder har høyest churn risk?"

Claude: *Leser alle memory-filer*
Claude: *Filtrerer på churnRisk: "high"*
Claude: *Lager rapport*
```

```
User: "Hvilke kunder har expansion-muligheter?"

Claude: *Leser alle memory-filer*
Claude: *Filtrerer på upcomingOpportunities*
Claude: *Sorterer etter estimatedValue*
Claude: *Lager prioritert liste*
```

## 🎯 Best Practices

### For Claude Code (deg):

1. **Alltid les memory** før du interagerer med kunde
2. **Oppdater memory** etter hver interaksjon
3. **Vær spesifikk** i insights - unngå generelle setninger
4. **Oppdater context** med nye læringspunkter
5. **Commit med beskrivende meldinger**:
   - `memory: Oppdater Acme context etter møte`
   - `memory: Legg til ny insight for Beta - budsjett-fleksibilitet`

### For Brukerne:

1. **Be om oppdateringer**: "Oppdater Acme memory etter dagens møte"
2. **Spør om innsikter**: "Hva vet vi om Acmes kommunikasjonspreferanser?"
3. **Bruk memory i agents**: "Draft e-post til Acme basert på vår historikk"
4. **Review regelmessig**: "Vis meg memory for alle high-value kunder"

## 🔐 Memory Security

**Memory er lagret i Git** - samme sikkerhet som resten av dataene:
- Private GitHub repo
- Kun dere to har tilgang
- Full versjonskontroll
- Kan revertes hvis feil

**Sensitive data**:
- Ikke lagre personlige detaljer som ikke er nødvendige
- Ikke lagre passord eller API-nøkler i memory
- Focus on business context, ikke private info

## 🚀 Memory Schema Utilities

Inkluder i `src/memory-manager.js`:

```javascript
class MemoryManager {
  async getMemory(customerId) {
    // Les memory fil
  }

  async updateMemory(customerId, updates) {
    // Oppdater memory
    // Commit og push
  }

  async addInteraction(customerId, interaction) {
    // Legg til ny interaksjon
  }

  async updateContext(customerId, newInsights) {
    // Oppdater context fil
  }

  async getInsights(customerId) {
    // Hent key insights
  }

  async analyzeHealth(customerId) {
    // Kalkuler health score
  }
}
```

## 🎯 Mål

Et memory-system som:
- ✅ Deles mellom begge brukere
- ✅ Lærer kontinuerlig
- ✅ Forbedrer kommunikasjon
- ✅ Identifiserer muligheter
- ✅ Reduserer churn-risiko
- ✅ Gir AI-agenter kontekst

**Resultat**: Bedre kundeforhold, mer personalisert kommunikasjon, og høyere verdi!
