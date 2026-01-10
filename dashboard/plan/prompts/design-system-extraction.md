# Design System Extraction Prompt Reference

> Denne filen inneholder referanse til den komplette design system extraction workflow.
> Bruk dette som grunnlag for Agent 6: Front-end Designer.

## Struktur

Prompten er delt i flere deler:

1. **DEL 1**: Design System Extraction & Documentation
2. **DEL 2**: Next.js Implementation & Validation
3. **DEL 2.1**: Font Extraction & Implementation
4. **DEL 2.2**: Content & Brand Personality Extraction
5. **DEL 3**: Brand Injection, Polish & Client Handoff

## Kritiske Elementer

### Lazy-Load Screenshot Fix

Dette er det viktigste problemet å løse. Standard `fullPage: true` fungerer IKKE.

```javascript
async function autoScrollForLazyLoad(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    let currentPosition = 0;
    
    while (currentPosition < scrollHeight) {
      window.scrollTo(0, currentPosition);
      await delay(200);
      currentPosition += viewportHeight * 0.8;
      
      // Stopp ved infinite scroll
      if (currentPosition > viewportHeight * 10) break;
    }
    
    window.scrollTo(0, 0);
    await delay(500);
  });
}
```

### Design Token Output Format

```json
{
  "colors": { "primary": {}, "secondary": {}, "neutral": {} },
  "typography": { "fontFamilies": {}, "scale": {}, "weights": {} },
  "spacing": { "unit": "0.25rem", "scale": [] },
  "borderRadius": {},
  "shadows": {},
  "components": { "button": {}, "card": {}, "input": {} }
}
```

### Validation Loop

For HVER komponent:
1. Bygg komponent
2. Ta Playwright screenshot
3. Sammenlign med referanse
4. Iterer til match
5. Gå til neste komponent

### Template vs Figma

**Anbefalt: Template-first**
- Raskere implementering
- Mer kontroll
- Lavere kompleksitet

**Figma kun hvis:**
- Kunden krever visuell godkjenning
- Du har Figma-lisens
- Prosjektet har tid/budsjett

## Filer Generert av Workflow

```
context/
├── visual-references/
│   ├── desktop/
│   │   ├── reference-1-full.png
│   │   ├── reference-2-full.png
│   │   └── reference-3-full.png
│   └── sections/
│       └── *.png
├── reference-analysis/
│   ├── reference-1-content.json
│   ├── reference-2-content.json
│   ├── reference-3-content.json
│   └── synthesis.json
├── design-principles.md
├── style-guide.md
├── component-plan.md
├── design-synthesis.md
├── content-strategy.md
└── brand-content/
    └── copy.json
```

## Implementering i Agent CRM

Disse konseptene skal implementeres som:

1. **Agent 6A: Design Token Extractor**
   - Playwright med lazy-load fix
   - DOM computed styles
   - Claude Vision analyse

2. **Agent 6B: Template Generator**
   - Token → Tailwind config
   - Template selection
   - Component generation

3. **Agent 6C: Content Generator**
   - Reference content extraction
   - AI content generation
   - Brand voice matching

4. **Agent 6D: Validation Agent**
   - Screenshot comparison
   - Iteration loop
   - Quality score

## Se Også

- [ROADMAP.md](../ROADMAP.md) - Komplett implementeringsplan
- [agents-server/src/tools/](../../agents-server/src/tools/) - Verktøy-implementasjoner
