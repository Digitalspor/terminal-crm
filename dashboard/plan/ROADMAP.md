# Agent CRM - Roadmap

## Oversikt

Denne roadmapen beskriver fremtidige utvidelser av Agent CRM, med fokus på **Agent 6: Front-end Designer** og **nye prosjekt-workflows**.

---

## ✅ Deployment Status (31. desember 2024)

### Fullført
- [x] Frontend deployed til Vercel (https://agent-crm-ten.vercel.app)
- [x] Next.js oppgradert til 16.1.1 (security fix)
- [x] Supabase database live
- [x] Gmail OAuth integrert
- [x] RLS policies for agency_integrations
- [x] **Task Planner (Agent 2)** - Serverless i Vercel
- [x] **Task Executor (Agent 3)** - Serverless i Vercel (simulert modus)
- [x] **Agent Monitoring** - Logs dashboard med agent_logs tabell
- [x] **Plan Approval Flow** - Generer → Godkjenn → Utfør
- [x] ANTHROPIC_API_KEY konfigurert i Vercel

### Neste steg
- [ ] **Deploy agents-server til Railway** ← For ekte SSH-utførelse
- [ ] Sett opp cron for Gmail polling (Agent 1)
- [ ] Koble SSH til Kinsta-sites
- [ ] Fiken API-integrasjon (Agent 5)

### Hva fungerer NÅ (uten Railway)
| Agent | Funksjon | Status |
|-------|----------|--------|
| Agent 2: Task Planner | Generer plan med AI | ✅ Serverless |
| Agent 3: Task Executor | Godkjenn og utfør | ✅ Simulert |
| Monitoring | Agent Logs dashboard | ✅ Live |

### Hva krever Railway
| Agent | Funksjon | Hvorfor |
|-------|----------|---------|
| Agent 1: Email Analyzer | Gmail polling | Cron job |
| Agent 3: Task Executor | SSH til Kinsta | Persistent connections |
| Agent 4: Client Responder | Send email | Gmail API |
| Agent 5: Invoice Drafter | Fiken/Tripletex | API-kall |

---

## 🎨 Agent 6: Front-end Designer

> Template-basert nettside-generering med GitHub + Vercel deploy

### Konsept (Forenklet)

~~Design extraction~~ → **Ferdig kuraterte templates** → Brand customization → Deploy

```
Kunde velger template → Tilpass farger/fonts/innhold → GitHub repo → Vercel deploy
        ↓                        ↓                          ↓              ↓
  Template Library        Brand Config              Auto-commit      Auto-deploy
  (10/10 design)          (colors, logo)            (GitHub API)     (Vercel API)
```

### Hvorfor IKKE design extraction?

❌ **Problemer med extraction-metoden:**
- Varierende resultater
- Lazy-load kompleksitet
- Fonts er ofte lisensiert
- Aldri 100% match
- Mye manuell finjustering

✅ **Fordeler med template-bibliotek:**
- 100% forutsigbare resultater
- High-fidelity design (10/10)
- Testet og optimalisert
- Rask leveranse
- Enkel brand-tilpasning

---

## 🧩 Agent 6A: Template Library

### React + Tailwind Template Bibliotek

Istedenfor Figma, bygg et internt template-bibliotek:

```
templates/
├── starter/                    # Minimalt utgangspunkt
│   ├── design-tokens.json
│   ├── tailwind.config.ts
│   └── components/
├── agency/                     # Byrå/studio template
│   ├── design-tokens.json
│   ├── tailwind.config.ts
│   └── components/
├── saas/                       # SaaS landing page
│   ├── design-tokens.json
│   ├── tailwind.config.ts
│   └── components/
├── ecommerce/                  # Nettbutikk
│   ├── design-tokens.json
│   ├── tailwind.config.ts
│   └── components/
└── portfolio/                  # Portfolio/kreativ
    ├── design-tokens.json
    ├── tailwind.config.ts
    └── components/
```

### Template Struktur

```typescript
// templates/agency/index.ts
export const agencyTemplate = {
  name: 'Agency Pro',
  description: 'Moderne byrå-template med mørk tema',
  preview: '/templates/agency/preview.png',
  
  designTokens: {
    // Pre-konfigurerte tokens
  },
  
  components: [
    'Hero',
    'Services',
    'Portfolio',
    'Team',
    'Testimonials',
    'Contact',
    'Footer'
  ],
  
  pages: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' }
  ],
  
  // Tailwind config som kan merges med ekstraherte tokens
  tailwindConfig: {
    theme: {
      extend: {
        colors: {
          primary: { /* ... */ },
          secondary: { /* ... */ }
        }
      }
    }
  }
}
```

### Token → Template Merge

```typescript
// agents-server/src/agents/template-generator.ts

interface GenerateOptions {
  templateId: string;
  extractedTokens: DesignTokens;
  brandContent: BrandContent;
  customizations?: Partial<DesignTokens>;
}

export async function generateFromTemplate(options: GenerateOptions) {
  const template = await loadTemplate(options.templateId);
  
  // Merge ekstraherte tokens med template defaults
  const mergedTokens = deepMerge(
    template.designTokens,
    options.extractedTokens,
    options.customizations
  );
  
  // Generer Tailwind config
  const tailwindConfig = generateTailwindConfig(mergedTokens);
  
  // Generer komponenter med brand content
  const components = await generateComponents(
    template.components,
    mergedTokens,
    options.brandContent
  );
  
  return {
    tailwindConfig,
    components,
    pages: template.pages
  };
}
```

---

---

## 🚀 Nytt Prosjekt Workflow

### Prosjekt Opprettelse i Dashboard

```typescript
// Database: projects table
interface Project {
  id: string;
  agency_id: string;
  customer_id: string;
  name: string;
  type: 'redesign' | 'new_website' | 'clone';
  status: 'research' | 'design' | 'development' | 'review' | 'launched';
  
  // Reference URLs for design extraction
  reference_urls: string[];
  
  // Extracted data
  design_tokens?: DesignTokens;
  research_report?: ResearchReport;
  content_package?: ContentPackage;
  
  // Template selection
  template_id?: string;
  template_customizations?: object;
  
  // Figma (optional)
  figma_file_id?: string;
  
  created_at: Date;
  updated_at: Date;
}
```

### Workflow Faser

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 1: RESEARCH (Automatisk)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Trigger: Prosjekt opprettet med reference_urls                      │
│                                                                       │
│  1. Deep Research Agent                                              │
│     - Konkurrent-analyse (screenshot + content extraction)           │
│     - Bransje-research (web search)                                  │
│     - Målgruppe-analyse                                              │
│                                                                       │
│  2. Design Token Extraction                                          │
│     - Playwright screenshots (med lazy-load fix)                     │
│     - DOM computed styles                                            │
│     - Claude Vision layout-analyse                                   │
│                                                                       │
│  Output: research_report + design_tokens                             │
│  Status: research → design                                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 2: DESIGN (Godkjenning)                      │
├─────────────────────────────────────────────────────────────────────┤
│  Dashboard viser:                                                    │
│  - Ekstraherte design tokens (farger, fonts, spacing)               │
│  - Foreslått template                                                │
│  - Research-rapport                                                  │
│                                                                       │
│  ✋ MANUELL GODKJENNING:                                             │
│  - [ ] Godkjenn design tokens                                        │
│  - [ ] Velg/tilpass template                                         │
│  - [ ] Legg til brand-spesifikke justeringer                        │
│                                                                       │
│  Status: design → development                                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  FASE 3: CONTENT PACKAGE (Automatisk)                │
├─────────────────────────────────────────────────────────────────────┤
│  Content Package Agent:                                              │
│  - Sitemap-generering basert på template                            │
│  - AI-generert tekstinnhold (tilpasset tone from research)          │
│  - Bildebehov-liste                                                  │
│  - SEO meta-data                                                     │
│                                                                       │
│  Image Generation Agent (valgfritt):                                 │
│  - Generer hero-bilder                                               │
│  - Generer illustrasjoner                                            │
│  - Stock image-forslag                                               │
│                                                                       │
│  Output: content_package                                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  FASE 4: DEVELOPMENT (Automatisk)                    │
├─────────────────────────────────────────────────────────────────────┤
│  Template Generator Agent:                                           │
│  - Merge design tokens med template                                  │
│  - Generer Tailwind config                                           │
│  - Injiser brand content                                             │
│  - Bygg Next.js prosjekt                                            │
│                                                                       │
│  Playwright Validation:                                              │
│  - Screenshot av hver side                                           │
│  - Sammenlign med referanse                                          │
│  - Rapport på avvik                                                  │
│                                                                       │
│  Status: development → review                                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 5: REVIEW (Godkjenning)                      │
├─────────────────────────────────────────────────────────────────────┤
│  Dashboard viser:                                                    │
│  - Preview av ferdig nettside                                        │
│  - Sammenligning med referanser                                      │
│  - Performance metrics                                               │
│  - SEO score                                                         │
│                                                                       │
│  ✋ MANUELL GODKJENNING:                                             │
│  - [ ] Visuell godkjenning                                          │
│  - [ ] Innhold godkjenning                                          │
│  - [ ] Klar for lansering                                           │
│                                                                       │
│  Status: review → launched                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Deep Research Agent

### Funksjonalitet

```typescript
// agents-server/src/agents/deep-research.ts

interface ResearchInput {
  projectId: string;
  referenceUrls: string[];
  industry: string;
  targetAudience?: string;
}

interface ResearchReport {
  competitors: CompetitorAnalysis[];
  industryTrends: string[];
  designPatterns: DesignPattern[];
  contentStrategy: ContentStrategyRecommendation;
  seoOpportunities: SEOOpportunity[];
  recommendations: string[];
}

export async function runDeepResearch(input: ResearchInput): Promise<ResearchReport> {
  // 1. Analyser hver referanse-URL
  const competitorAnalyses = await Promise.all(
    input.referenceUrls.map(url => analyzeCompetitor(url))
  );
  
  // 2. Web search for bransje-trender
  const industryTrends = await searchIndustryTrends(input.industry);
  
  // 3. Identifiser design patterns på tvers av referanser
  const designPatterns = synthesizeDesignPatterns(competitorAnalyses);
  
  // 4. Content strategi basert på referanse-analyse
  const contentStrategy = await generateContentStrategy(competitorAnalyses);
  
  // 5. SEO-muligheter
  const seoOpportunities = await identifySEOOpportunities(
    input.referenceUrls,
    input.industry
  );
  
  // 6. AI-generert anbefalinger
  const recommendations = await generateRecommendations({
    competitors: competitorAnalyses,
    trends: industryTrends,
    patterns: designPatterns
  });
  
  return {
    competitors: competitorAnalyses,
    industryTrends,
    designPatterns,
    contentStrategy,
    seoOpportunities,
    recommendations
  };
}

async function analyzeCompetitor(url: string): Promise<CompetitorAnalysis> {
  // Screenshot med lazy-load fix
  const screenshots = await captureFullPageScreenshot({
    url,
    outputPath: `temp/${slugify(url)}.png`,
    waitForLazyLoad: true
  });
  
  // Ekstraher innhold
  const content = await extractContent(url);
  
  // Design token extraction
  const tokens = await extractDesignTokens(url);
  
  // Claude Vision analyse
  const visualAnalysis = await analyzeWithVision(screenshots.path);
  
  return {
    url,
    screenshots,
    content,
    designTokens: tokens,
    visualAnalysis,
    strengths: visualAnalysis.strengths,
    weaknesses: visualAnalysis.weaknesses
  };
}
```

---

## 📝 Content Package Agent

### Struktur

```typescript
interface ContentPackage {
  sitemap: SitemapPage[];
  pages: PageContent[];
  seoMeta: SEOMeta[];
  imageRequirements: ImageRequirement[];
  copyGuidelines: CopyGuidelines;
}

interface PageContent {
  path: string;
  title: string;
  sections: SectionContent[];
}

interface SectionContent {
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'about' | 'contact';
  headline: string;
  subheadline?: string;
  body?: string;
  ctas?: { text: string; url: string; variant: 'primary' | 'secondary' }[];
  items?: { title: string; description: string; icon?: string }[];
}
```

---

## 🖼️ Image Generation Agent

### Integrasjoner

```typescript
// agents-server/src/tools/image-generation.ts

type ImageProvider = 'replicate' | 'dalle' | 'midjourney';

interface GenerateImageOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  provider?: ImageProvider;
}

export async function generateImage(options: GenerateImageOptions): Promise<string> {
  const provider = options.provider || 'replicate';
  
  switch (provider) {
    case 'replicate':
      return generateWithReplicate(options);
    case 'dalle':
      return generateWithDalle(options);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

async function generateWithReplicate(options: GenerateImageOptions): Promise<string> {
  const Replicate = require('replicate');
  const replicate = new Replicate();
  
  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: options.prompt,
        negative_prompt: "low quality, blurry, distorted",
        width: options.aspectRatio === '16:9' ? 1344 : 1024,
        height: options.aspectRatio === '16:9' ? 768 : 1024,
      }
    }
  );
  
  return output[0]; // URL til generert bilde
}
```

---

## 🔎 SEO Agent

### Teknisk SEO Generering

```typescript
interface SEOPackage {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  schema: object; // JSON-LD
  sitemap: string; // XML
  robots: string;
}

export async function generateSEOPackage(
  project: Project,
  content: ContentPackage
): Promise<SEOPackage> {
  // Generate meta for each page
  const meta = await generateMetaTags(content.pages);
  
  // Generate JSON-LD schema
  const schema = generateSchema(project, content);
  
  // Generate sitemap.xml
  const sitemap = generateSitemap(content.sitemap, project.domain);
  
  // Generate robots.txt
  const robots = generateRobots(project.domain);
  
  return { meta, schema, sitemap, robots };
}

function generateSchema(project: Project, content: ContentPackage): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": project.name,
    "url": `https://${project.domain}`,
    "logo": `https://${project.domain}/logo.png`,
    // ... mer schema
  };
}
```

---

## 📊 Database-utvidelser

```sql
-- Prosjekter
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('redesign', 'new_website', 'clone')) DEFAULT 'new_website',
  status TEXT CHECK (status IN ('research', 'design', 'development', 'review', 'launched')) DEFAULT 'research',
  
  -- Reference URLs
  reference_urls TEXT[] DEFAULT '{}',
  
  -- Extracted/Generated data
  design_tokens JSONB,
  research_report JSONB,
  content_package JSONB,
  seo_package JSONB,
  
  -- Template
  template_id TEXT,
  template_customizations JSONB,
  
  -- Output
  generated_repo_url TEXT,
  preview_url TEXT,
  production_url TEXT,
  
  -- Figma (optional)
  figma_file_id TEXT,
  figma_file_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design Tokens (versjonert)
CREATE TABLE design_token_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  version INTEGER NOT NULL,
  tokens JSONB NOT NULL,
  source_url TEXT,
  screenshots TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, version)
);

-- Genererte bilder
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  prompt TEXT NOT NULL,
  provider TEXT NOT NULL,
  image_url TEXT,
  local_path TEXT,
  status TEXT DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  category TEXT,
  design_tokens JSONB NOT NULL,
  component_list TEXT[] NOT NULL,
  page_list JSONB NOT NULL,
  tailwind_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prosjekt-hendelser (audit log)
CREATE TABLE project_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🗓️ Implementeringsplan

### Sprint 1: Fundament (Uke 1-2)
- [ ] Database-migrasjoner for projects, templates, etc.
- [ ] Prosjekt CRUD UI i dashboard
- [ ] Playwright setup med lazy-load fix
- [ ] Basis screenshot-capture

### Sprint 2: Design Token Extraction (Uke 3-4)
- [ ] Computed styles extraction
- [ ] Font detection og mapping
- [ ] Color palette extraction
- [ ] Spacing/radius analysis
- [ ] Claude Vision integration for layout

### Sprint 3: Template System (Uke 5-6)
- [ ] Template database struktur
- [ ] 3-5 basis templates (React + Tailwind)
- [ ] Token → Tailwind config generator
- [ ] Template selection UI

### Sprint 4: Content Agents (Uke 7-8)
- [ ] Deep Research agent
- [ ] Content Package generator
- [ ] SEO package generator

### Sprint 5: Image Generation (Uke 9-10)
- [ ] Replicate/DALL-E integration
- [ ] Prompt generation fra kontekst
- [ ] Image requirement → generation pipeline

### Sprint 6: Fullføring (Uke 11-12)
- [ ] Prosjekt workflow UI
- [ ] Preview/validation system
- [ ] Export til GitHub repo
- [ ] Documentation

---

## 🔧 Tekniske Avhengigheter

### NPM Pakker (agents-server)

```json
{
  "playwright": "^1.40.0",
  "sharp": "^0.33.0",
  "replicate": "^0.25.0",
  "openai": "^4.0.0"
}
```

### API-nøkler

| Tjeneste | Formål | Prioritet |
|----------|--------|-----------|
| Replicate | Bildegenerering (SDXL) | Medium |
| OpenAI | DALL-E 3 (alternativ) | Lav |

---

---

## 📝 Prompt-mal Referanse

Din eksisterende prompt er lagret her for referanse. Nøkkel-elementer som skal brukes:

### Fra DEL 1 (Extraction):
- Playwright verification
- Lazy-load screenshot fix ← **KRITISK**
- DOM computed styles extraction
- Font detection
- Design synthesis workflow

### Fra DEL 2 (Implementation):
- Tailwind v4 @theme config
- Component build loop med validation
- Typography scale implementation

### Fra DEL 2.2 (Content):
- Reference content extraction
- Tone/vocabulary analysis
- Brand voice synthesis

### Fra DEL 3 (Polish):
- Brand injection workflow
- Animation patterns
- Client handoff package

---

*Sist oppdatert: 30. desember 2024*
