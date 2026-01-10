# 🚀 Migreringsplan: Blessed → Ink

**Dato:** 2026-01-10
**Mål:** Migrere CRM Terminal fra ustabil Blessed til moderne Ink (React for terminal)
**Estimert tid:** 1-2 arbeidsdager
**Status:** Planleggingsfase

---

## 📋 Innholdsfortegnelse

1. [Executive Summary](#executive-summary)
2. [Hvorfor Ink?](#hvorfor-ink)
3. [Arkitektur Oversikt](#arkitektur-oversikt)
4. [Migreringsplan - Fase for Fase](#migreringsplan---fase-for-fase)
5. [Real-Time Git Sync](#real-time-git-sync)
6. [Kodeeksempler](#kodeeksempler)
7. [Testing Strategi](#testing-strategi)
8. [Rollback Plan](#rollback-plan)
9. [Timeline](#timeline)
10. [Vedlegg](#vedlegg)

---

## Executive Summary

### Problem
- `blessed` og `blessed-contrib` er utdatert (sist oppdatert 2016)
- Ustabil rendering (crashes med emojis, menu items)
- Vanskelig debugging (ingen error traces)
- Inkonsistent event håndtering
- Blokkerer produktiv utvikling

### Løsning
Migrer til **Ink** - React for terminal:
- Moderne, aktivt vedlikeholdt (2024)
- React komponenter og hooks
- Stabilt og forutsigbart
- Flott dokumentasjon
- Stort økosystem av ferdiglagde komponenter
- Enkel testing

### Gevinst
- **10x raskere utvikling** - Ingen mer debugging av mystiske crashes
- **Stabil brukeropplevelse** - Forutsigbar rendering
- **Real-time sync** - Automatisk refresh når kollega committer
- **Maintainability** - Moderne kodekvalitet med React patterns
- **Testbarhet** - Kan teste UI komponenter

### Risiko
- **Lav risiko** - Ink er battle-tested (brukes av GitHub CLI, Gatsby CLI, etc.)
- **Reversibel** - Kan rulle tilbake til Blessed hvis nødvendig
- **Gradvis migrasjon** - Kan migrere en view om gangen

---

## Hvorfor Ink?

### Sammenligningstabell

| Kriterium | Blessed | Ink | Fordel |
|-----------|---------|-----|--------|
| **Stabilitet** | ⭐ Crashes ofte | ⭐⭐⭐⭐⭐ Svært stabil | Ink |
| **Dokumentasjon** | ⭐ Minimal, utdatert | ⭐⭐⭐⭐⭐ Excellent | Ink |
| **Community** | ❌ Dead (2016) | ✅ Aktiv (2024) | Ink |
| **Debugging** | ❌ Ingen stack traces | ✅ React DevTools | Ink |
| **Event håndtering** | ❌ Inkonsistent | ✅ Standard React | Ink |
| **TypeScript** | ❌ Nei | ✅ Ja | Ink |
| **Testing** | ❌ Vanskelig | ✅ Jest/React Testing Library | Ink |
| **Emoji/Unicode** | ⚠️ Ustabil | ✅ Full support | Ink |
| **Layout** | 📐 Pixels/percent (fragile) | 📦 Flexbox (moderne) | Ink |
| **State management** | ❌ Manuell | ✅ React hooks | Ink |
| **Komponenter** | 🔧 DIY | 📦 Stort økosystem | Ink |
| **Learning curve** | ⚠️ Unik API | ✅ React (kjent) | Ink |

### Ink Brukes Av
- GitHub CLI (`gh`)
- Gatsby CLI
- Shopify CLI
- Prisma CLI
- Jest (test output)
- 1000+ andre prosjekter

### Performance
- Ink bruker `yoga` (Flexbox engine fra React Native)
- Effektiv reconciliation (kun oppdaterer endringer)
- Ingen reflow issues som Blessed har
- Smooth rendering selv med komplekse layouts

---

## Arkitektur Oversikt

### Nåværende Struktur (Blessed)

```
src/
├── index.js                 # CLI entry point
├── dashboard-blessed.js     # 1213 linjer monolitt med alle views
├── data-manager.js          # Data CRUD
├── fiken-client.js          # Fiken API
├── git-sync.js              # Git operations
└── ...andre tjenester
```

**Problem:**
- Alt UI i én fil (1213 linjer)
- Kompleks state management med globale variabler
- Event handlers spredd overalt
- Vanskelig å teste

### Ny Struktur (Ink)

```
src/
├── index.js                 # CLI entry (samme)
├── dashboard.jsx            # Ink app entry
│
├── ui/                      # Ink komponenter
│   ├── App.jsx              # Root component med routing
│   ├── views/               # Hovedvisninger
│   │   ├── MainMenu.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CustomerList.jsx
│   │   ├── CustomerDetail.jsx
│   │   ├── EconomyMenu.jsx
│   │   ├── InvoiceList.jsx
│   │   ├── AccountsList.jsx
│   │   ├── OverdueList.jsx
│   │   ├── ProjectList.jsx
│   │   └── Overview.jsx
│   │
│   ├── components/          # Gjenbrukbare komponenter
│   │   ├── StatusBar.jsx
│   │   ├── StatBox.jsx
│   │   ├── Menu.jsx
│   │   ├── Table.jsx
│   │   ├── ProgressBar.jsx
│   │   └── HelpText.jsx
│   │
│   └── hooks/               # Custom React hooks
│       ├── useData.js       # Data loading hook
│       ├── useGitSync.js    # Real-time sync hook
│       └── useNavigation.js # View routing hook
│
├── lib/                     # Utilities
│   ├── git-watcher.js       # Real-time Git monitoring
│   ├── smart-sync.js        # Adaptive sync strategy
│   └── format.js            # Formattering helpers
│
├── data-manager.js          # Beholdes som den er
├── fiken-client.js          # Beholdes som den er
├── git-sync.js              # Beholdes som den er
└── ...andre tjenester       # Ingen endringer
```

**Fordeler:**
- Modulær struktur (små, testbare filer)
- Komponentbasert (gjenbruk og isolasjon)
- React patterns (hooks, context, etc.)
- Enkel testing
- Lett å utvide

### Dataflyt

```
┌─────────────────────────────────────────────────────┐
│                   Ink App (React)                    │
│                                                      │
│  ┌────────────┐    ┌──────────────┐    ┌─────────┐ │
│  │ MainMenu   │───▶│ CustomerList │───▶│ Detail  │ │
│  └────────────┘    └──────────────┘    └─────────┘ │
│         │                                            │
│         ▼                                            │
│  ┌────────────┐    ┌──────────────┐                │
│  │ EconomyMenu│───▶│ InvoiceList  │                │
│  └────────────┘    └──────────────┘                │
└───────────┬──────────────────────────────────────────┘
            │
            ▼
    ┌───────────────┐
    │ useData Hook  │ ◀──── Git Watcher (30s polling)
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ DataManager   │
    │ (Existing)    │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  JSON Files   │
    │  (Git repo)   │
    └───────────────┘
```

### State Management

**Global State (React Context):**
```jsx
const AppContext = createContext({
  customers: [],
  invoices: [],
  projects: [],
  currentView: 'main',
  selectedCustomer: null,
  reload: () => {},
  navigate: (view) => {}
});
```

**Local State (Component useState):**
- Form inputs
- UI state (loading, errors)
- Menu selections

**No Redux Needed** - React Context + hooks er nok for denne skalaen

---

## Migreringsplan - Fase for Fase

### Fase 0: Forberedelse (30 min)

#### 0.1 Installer Dependencies

```bash
npm install --save ink react ink-select-input ink-table ink-spinner ink-text-input ink-box ink-gradient
npm install --save chokidar lodash
npm install --save-dev @types/react babel-preset-react-app
```

#### 0.2 Konfigurer Babel (for JSX)

Opprett `babel.config.json`:
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

Installer Babel:
```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/node
```

#### 0.3 Oppdater package.json

```json
{
  "scripts": {
    "crm": "node src/index.js",
    "dashboard": "babel-node src/dashboard.jsx",
    "dev": "nodemon --exec babel-node src/dashboard.jsx"
  }
}
```

#### 0.4 Opprett mappestruktur

```bash
mkdir -p src/ui/views
mkdir -p src/ui/components
mkdir -p src/ui/hooks
mkdir -p src/lib
```

#### 0.5 Backup Blessed kode

```bash
cp src/dashboard-blessed.js src/dashboard-blessed.backup.js
git add src/dashboard-blessed.backup.js
git commit -m "backup: Save blessed dashboard before Ink migration"
```

---

### Fase 1: Grunnmur (2-3 timer)

#### 1.1 Opprett App Context

**Fil:** `src/ui/AppContext.jsx`

```jsx
import React, {createContext, useState, useContext} from 'react';

const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [data, setData] = useState({
    customers: [],
    invoices: [],
    projects: [],
    expenses: []
  });

  const navigate = (view, data = {}) => {
    setCurrentView(view);
    if (data.customer) setSelectedCustomer(data.customer);
  };

  const reload = () => {
    // Will be implemented with useData hook
  };

  return (
    <AppContext.Provider value={{
      currentView,
      selectedCustomer,
      data,
      navigate,
      reload,
      setData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
```

#### 1.2 Opprett Data Hook

**Fil:** `src/ui/hooks/useData.js`

```jsx
import {useState, useEffect} from 'react';
import {dataManager} from '../../data-manager.js';

export const useData = () => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [c, i, p, e] = await Promise.all([
        dataManager.getAllCustomers(),
        dataManager.getAllInvoices(),
        dataManager.getAllProjects(),
        dataManager.getAllExpenses()
      ]);
      setCustomers(c);
      setInvoices(i);
      setProjects(p);
      setExpenses(e);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    customers,
    invoices,
    projects,
    expenses,
    loading,
    error,
    reload: loadData
  };
};
```

#### 1.3 Opprett Git Sync Hook

**Fil:** `src/ui/hooks/useGitSync.js`

```jsx
import {useEffect} from 'react';
import {GitWatcher} from '../../lib/git-watcher.js';

export const useGitSync = (onSync) => {
  useEffect(() => {
    const watcher = new GitWatcher('./data', 30000);

    watcher.on('remote-change', (commit) => {
      // Colleague pushed changes
      onSync('remote', commit);
    });

    watcher.on('local-change', (path) => {
      // Local file change
      onSync('local', path);
    });

    watcher.on('error', (err) => {
      console.error('Git sync error:', err);
    });

    watcher.start();

    return () => watcher.stop();
  }, [onSync]);
};
```

#### 1.4 Implementer Git Watcher

**Fil:** `src/lib/git-watcher.js`

```javascript
import chokidar from 'chokidar';
import {execSync} from 'child_process';
import EventEmitter from 'events';
import path from 'path';

export class GitWatcher extends EventEmitter {
  constructor(dataDir, pollInterval = 30000) {
    super();
    this.dataDir = path.resolve(dataDir);
    this.pollInterval = pollInterval;
    this.lastCommit = this.getCurrentCommit();
    this.watcher = null;
    this.pollTimer = null;
  }

  start() {
    // Watch local file changes
    this.watcher = chokidar.watch(`${this.dataDir}/**/*.json`, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    this.watcher.on('change', (filepath) => {
      this.emit('local-change', filepath);
    });

    // Poll remote for changes
    this.pollTimer = setInterval(() => {
      this.checkRemote();
    }, this.pollInterval);

    // Check immediately on start
    this.checkRemote();
  }

  async checkRemote() {
    try {
      // Fetch without merging
      execSync('git fetch origin', {cwd: this.dataDir, stdio: 'pipe'});

      const remoteCommit = execSync(
        'git rev-parse origin/main',
        {cwd: this.dataDir, encoding: 'utf-8'}
      ).trim();

      if (remoteCommit !== this.lastCommit) {
        // New changes from colleague!
        try {
          execSync('git pull --rebase origin main', {cwd: this.dataDir, stdio: 'pipe'});
          this.lastCommit = remoteCommit;
          this.emit('remote-change', remoteCommit);
        } catch (pullError) {
          this.emit('error', new Error('Git pull failed: ' + pullError.message));
        }
      }
    } catch (err) {
      // Network error or no remote - ignore silently
      if (!err.message.includes('Could not resolve host')) {
        this.emit('error', err);
      }
    }
  }

  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', {
        cwd: this.dataDir,
        encoding: 'utf-8'
      }).trim();
    } catch (err) {
      return null;
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}
```

#### 1.5 Opprett Gjenbrukbare Komponenter

**Fil:** `src/ui/components/StatusBar.jsx`

```jsx
import React from 'react';
import {Box, Text} from 'ink';

export const StatusBar = ({time, date, revenue}) => (
  <Box paddingX={1} backgroundColor="cyan">
    <Text color="black" bold>
      🕐 {time} │ 📅 {date} │ 💰 {revenue.toLocaleString('nb-NO')} kr denne måneden
    </Text>
  </Box>
);
```

**Fil:** `src/ui/components/StatBox.jsx`

```jsx
import React from 'react';
import {Box, Text} from 'ink';

export const StatBox = ({label, value, color = 'white', icon}) => (
  <Box
    borderStyle="round"
    borderColor={color}
    paddingX={2}
    paddingY={1}
    minWidth={20}
  >
    <Box flexDirection="column">
      <Text color={color}>{icon} {label}</Text>
      <Text bold color="white">{value}</Text>
    </Box>
  </Box>
);
```

**Fil:** `src/ui/components/HelpText.jsx`

```jsx
import React from 'react';
import {Box, Text} from 'ink';

export const HelpText = ({commands}) => (
  <Box justifyContent="center" backgroundColor="white" paddingX={1}>
    <Text color="black">
      {commands.map((cmd, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' │ '}
          {cmd}
        </React.Fragment>
      ))}
    </Text>
  </Box>
);
```

---

### Fase 2: Migrer Main Menu (1 time)

#### 2.1 Opprett Main Menu Component

**Fil:** `src/ui/views/MainMenu.jsx`

```jsx
import React, {useState} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {useApp} from '../AppContext.jsx';

export const MainMenu = () => {
  const {navigate} = useApp();

  const items = [
    {label: '👥  KUNDER', value: 'customers'},
    {label: '💰  ØKONOMI', value: 'economy'},
    {label: '📁  PROSJEKTER', value: 'projects'},
    {label: '📊  OVERSIKT', value: 'overview'},
    {label: '📝  NOTATER', value: 'notes'},
    {label: '📅  KALENDER', value: 'calendar'},
    {label: '', value: 'separator'},
    {label: '❌  AVSLUTT', value: 'exit'}
  ];

  const handleSelect = (item) => {
    if (item.value === 'exit') {
      process.exit(0);
    } else if (item.value === 'separator') {
      return; // Ignore separator
    } else if (item.value === 'notes' || item.value === 'calendar') {
      // Not implemented yet
      return;
    } else {
      navigate(item.value);
    }
  };

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={1}>
      <Box
        borderStyle="double"
        borderColor="cyan"
        paddingX={4}
        paddingY={1}
        width={60}
      >
        <Box flexDirection="column" width="100%">
          <Box justifyContent="center" marginBottom={1}>
            <Text bold color="cyan">🎯 HOVEDMENY</Text>
          </Box>
          <SelectInput items={items} onSelect={handleSelect} />
        </Box>
      </Box>
    </Box>
  );
};
```

#### 2.2 Opprett Stats Display

**Fil:** `src/ui/views/StatsDisplay.jsx`

```jsx
import React from 'react';
import {Box, Text} from 'ink';
import {StatBox} from '../components/StatBox.jsx';

export const StatsDisplay = ({customers, projects, overdueCount, overdueAmount}) => (
  <Box
    flexDirection="column"
    alignItems="center"
    borderStyle="single"
    borderColor="cyan"
    paddingX={2}
    paddingY={1}
    marginTop={1}
    width={80}
  >
    <Text bold color="cyan">📊 QUICK STATS</Text>
    <Box marginTop={1} justifyContent="space-around" width="100%">
      <Text>
        👥 <Text bold>{customers}</Text> kunder  │
        📁 <Text bold>{projects}</Text> aktive prosjekter  │
        <Text color="red">
          🔔 <Text bold>{overdueCount}</Text> forfalte fakturaer (
          <Text bold>{overdueAmount.toLocaleString('nb-NO')} kr</Text>)
        </Text>
      </Text>
    </Box>
  </Box>
);
```

---

### Fase 3: Migrer Economy Menu (1 time)

#### 3.1 Economy Menu Component

**Fil:** `src/ui/views/EconomyMenu.jsx`

```jsx
import React from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {useApp} from '../AppContext.jsx';

export const EconomyMenu = () => {
  const {navigate} = useApp();

  const items = [
    {label: '💰  FAKTURAER', value: 'invoices'},
    {label: '🏦  KONTOER & SALDO', value: 'accounts'},
    {label: '🔔  PURRING', value: 'overdue'}
  ];

  const handleSelect = (item) => {
    navigate(item.value);
  };

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      <Box
        borderStyle="double"
        borderColor="yellow"
        paddingX={4}
        paddingY={1}
        width={60}
      >
        <Box flexDirection="column" width="100%">
          <Box justifyContent="center" marginBottom={1}>
            <Text bold color="yellow">💰 ØKONOMI</Text>
          </Box>
          <SelectInput items={items} onSelect={handleSelect} />
          <Box marginTop={1} justifyContent="center">
            <Text dimColor>ESC: tilbake</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
```

---

### Fase 4: Migrer List Views (2 timer)

#### 4.1 Customer List

**Fil:** `src/ui/views/CustomerList.jsx`

```jsx
import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {useApp} from '../AppContext.jsx';

export const CustomerList = () => {
  const {data, navigate} = useApp();
  const {customers, projects, invoices} = data;

  const items = useMemo(() => {
    return customers.map(customer => {
      const customerProjects = projects.filter(p => p.customerId === customer.id).length;
      const customerInvoices = invoices.filter(i => i.customerId === customer.id).length;

      return {
        label: `${customer.name} - ${customer.contact.name} (${customer.contact.email}) - ${customerProjects}p / ${customerInvoices}f`,
        value: customer.id,
        customer
      };
    });
  }, [customers, projects, invoices]);

  const handleSelect = (item) => {
    navigate('customer-detail', {customer: item.customer});
  };

  return (
    <Box flexDirection="column" padding={1} height="100%">
      <Box
        borderStyle="single"
        borderColor="green"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        flexGrow={1}
      >
        <Box marginBottom={1}>
          <Text bold color="green">👥 KUNDER</Text>
          <Text dimColor> (↑↓: navigér │ Enter: detaljer │ ESC: tilbake)</Text>
        </Box>
        <SelectInput items={items} onSelect={handleSelect} limit={20} />
      </Box>
    </Box>
  );
};
```

#### 4.2 Invoice List (med ink-table)

**Fil:** `src/ui/views/InvoiceList.jsx`

```jsx
import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import Table from 'ink-table';
import {useApp} from '../AppContext.jsx';

export const InvoiceList = () => {
  const {data} = useApp();
  const {invoices, customers} = data;

  const tableData = useMemo(() => {
    return invoices.map(inv => {
      const customer = customers.find(c => c.id === inv.customerId);
      const statusIcon = inv.status === 'draft' ? '📝' : inv.status === 'sent' ? '📤' : '✅';
      const amount = (inv.total / 100).toLocaleString('nb-NO');

      return {
        'Faktura': inv.invoiceNumber,
        'Kunde': customer?.name || inv.customerId,
        'Beløp': `${amount} kr`,
        'Forfaller': inv.dueDate,
        'Status': `${statusIcon} ${inv.status}`
      };
    });
  }, [invoices, customers]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="yellow">💰 ØKONOMI - FAKTURAER</Text>
        <Text dimColor> (↑↓: navigér │ ESC: tilbake)</Text>
      </Box>
      <Box borderStyle="single" borderColor="yellow" padding={1}>
        <Table data={tableData} />
      </Box>
    </Box>
  );
};
```

#### 4.3 Project List

**Fil:** `src/ui/views/ProjectList.jsx`

```jsx
import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import Table from 'ink-table';
import {useApp} from '../AppContext.jsx';

export const ProjectList = () => {
  const {data} = useApp();
  const {projects, customers} = data;

  const tableData = useMemo(() => {
    return projects.map(p => {
      const customer = customers.find(c => c.id === p.customerId);
      const progress = Math.round((p.spentHours / p.estimatedHours) * 100);
      const statusIcon = p.status === 'completed' ? '✅' : '🔄';
      const progressBar = '█'.repeat(Math.round(progress / 5)) +
                          '░'.repeat(20 - Math.round(progress / 5)) +
                          ` ${progress}%`;

      return {
        'Prosjekt': p.name,
        'Kunde': customer?.name || p.customerId,
        'Fremdrift': progressBar,
        'Status': `${statusIcon} ${p.status}`
      };
    });
  }, [projects, customers]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">📁 PROSJEKTER</Text>
        <Text dimColor> (↑↓: navigér │ ESC: tilbake)</Text>
      </Box>
      <Box borderStyle="single" borderColor="magenta" padding={1}>
        <Table data={tableData} />
      </Box>
    </Box>
  );
};
```

---

### Fase 5: Migrer Detail Views (1-2 timer)

#### 5.1 Customer Detail

**Fil:** `src/ui/views/CustomerDetail.jsx`

```jsx
import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import {useApp} from '../AppContext.jsx';

const ProgressBar = ({percent}) => {
  const width = 20;
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const color = percent < 33 ? 'red' : percent < 66 ? 'yellow' : 'green';

  return (
    <Text>
      <Text color={color}>{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(empty)}</Text>
      {' '}{percent}%
    </Text>
  );
};

export const CustomerDetail = () => {
  const {selectedCustomer, data} = useApp();
  const {projects, invoices} = data;

  const customerProjects = useMemo(() =>
    projects.filter(p => p.customerId === selectedCustomer.id),
    [projects, selectedCustomer]
  );

  const customerInvoices = useMemo(() =>
    invoices.filter(i => i.customerId === selectedCustomer.id),
    [invoices, selectedCustomer]
  );

  const totalAmount = useMemo(() =>
    customerInvoices.reduce((sum, inv) => sum + inv.total, 0) / 100,
    [customerInvoices]
  );

  if (!selectedCustomer) {
    return <Text>No customer selected</Text>;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">📋 KUNDEDETALJER</Text>
        <Text dimColor> (↑↓: scroll │ ESC: tilbake)</Text>
      </Box>

      <Box
        borderStyle="double"
        borderColor="yellow"
        padding={2}
        flexDirection="column"
      >
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{selectedCustomer.name.toUpperCase()}</Text>
        </Box>

        {/* Contact Info */}
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="green">┌─ KONTAKTINFORMASJON</Text>
          <Text>│ <Text bold>Navn:</Text>     {selectedCustomer.contact.name}</Text>
          <Text>│ <Text bold>E-post:</Text>   {selectedCustomer.contact.email}</Text>
          <Text>│ <Text bold>Telefon:</Text>  {selectedCustomer.contact.phone}</Text>
          <Text>│ <Text bold>Org.nr:</Text>   {selectedCustomer.orgNr || 'N/A'}</Text>
          <Text>│</Text>
          <Text>│ <Text bold>Adresse:</Text>  {selectedCustomer.address.street}</Text>
          <Text>│            {selectedCustomer.address.postalCode} {selectedCustomer.address.city}</Text>
          <Text bold color="green">└─</Text>
        </Box>

        {/* Projects */}
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="magenta">┌─ PROSJEKTER ({customerProjects.length})</Text>
          {customerProjects.length === 0 ? (
            <Text dimColor>│ Ingen prosjekter enda</Text>
          ) : (
            customerProjects.map((p, i) => {
              const progress = Math.round((p.spentHours / p.estimatedHours) * 100);
              const icon = p.status === 'completed' ? '✅' : '🔄';
              return (
                <Box key={i} flexDirection="column">
                  <Text>│ {icon} <Text bold>{p.name}</Text></Text>
                  <Text>│    <ProgressBar percent={progress} /></Text>
                  <Text>│    {p.spentHours}/{p.estimatedHours}t · {p.budget.toLocaleString('nb-NO')} kr</Text>
                </Box>
              );
            })
          )}
          <Text bold color="magenta">└─</Text>
        </Box>

        {/* Invoices */}
        <Box flexDirection="column">
          <Text bold color="yellow">
            ┌─ FAKTURA-HISTORIKK ({customerInvoices.length} · {totalAmount.toLocaleString('nb-NO')} kr totalt)
          </Text>
          {customerInvoices.length === 0 ? (
            <Text dimColor>│ Ingen fakturaer enda</Text>
          ) : (
            customerInvoices.slice(0, 10).map((inv, i) => {
              const icon = inv.status === 'draft' ? '📝' : inv.status === 'sent' ? '📤' : '✅';
              const amount = (inv.total / 100).toLocaleString('nb-NO');
              return (
                <Text key={i}>
                  │ {icon} <Text bold>{inv.invoiceNumber}</Text> │ {amount} kr │ {inv.dueDate}
                </Text>
              );
            })
          )}
          <Text bold color="yellow">└─</Text>
        </Box>
      </Box>
    </Box>
  );
};
```

---

### Fase 6: Root App Component (1 time)

#### 6.1 Main App Component med Routing

**Fil:** `src/ui/App.jsx`

```jsx
import React, {useState, useEffect} from 'react';
import {Box, Text, useApp as useInkApp, useInput} from 'ink';
import {AppProvider, useApp} from './AppContext.jsx';
import {useData} from './hooks/useData.js';
import {useGitSync} from './hooks/useGitSync.js';

import {StatusBar} from './components/StatusBar.jsx';
import {HelpText} from './components/HelpText.jsx';
import {MainMenu} from './views/MainMenu.jsx';
import {StatsDisplay} from './views/StatsDisplay.jsx';
import {EconomyMenu} from './views/EconomyMenu.jsx';
import {CustomerList} from './views/CustomerList.jsx';
import {CustomerDetail} from './views/CustomerDetail.jsx';
import {InvoiceList} from './views/InvoiceList.jsx';
import {ProjectList} from './views/ProjectList.jsx';

const AppContent = () => {
  const {exit} = useInkApp();
  const {currentView, navigate, setData} = useApp();
  const {customers, invoices, projects, expenses, loading, reload} = useData();

  const [time, setTime] = useState(new Date().toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'}));
  const [date] = useState(new Date().toLocaleDateString('nb-NO', {weekday: 'short', day: '2-digit', month: 'short'}));

  // Update data in context
  useEffect(() => {
    setData({customers, invoices, projects, expenses});
  }, [customers, invoices, projects, expenses]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'}));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Git sync
  useGitSync((type, info) => {
    reload(); // Reload data when git changes detected
  });

  // Global keyboard shortcuts
  useInput((input, key) => {
    if (key.escape) {
      // Navigate back
      if (currentView === 'main') {
        exit();
      } else if (currentView === 'customer-detail') {
        navigate('customers');
      } else if (['invoices', 'accounts', 'overdue'].includes(currentView)) {
        navigate('economy');
      } else {
        navigate('main');
      }
    }

    if (key.ctrl && input === 'c') {
      exit();
    }

    if (key.ctrl && input === 'r') {
      reload();
    }
  });

  // Calculate stats
  const monthRevenue = invoices
    .filter(i => {
      const invDate = new Date(i.date);
      const now = new Date();
      return invDate.getMonth() === now.getMonth() &&
             invDate.getFullYear() === now.getFullYear() &&
             i.status !== 'draft';
    })
    .reduce((sum, i) => sum + i.total, 0) / 100;

  const activeProjects = projects.filter(p => p.status === 'in-progress').length;

  const overdueInvoices = invoices.filter(i => {
    if (i.status === 'paid') return false;
    if (!i.dueDate) return false;
    const dueDate = new Date(i.dueDate);
    return dueDate < new Date();
  });
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0) / 100;

  if (loading) {
    return (
      <Box justifyContent="center" alignItems="center" height={20}>
        <Text color="cyan">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      {/* Status Bar */}
      <StatusBar time={time} date={date} revenue={monthRevenue} />

      {/* Main Content */}
      <Box flexGrow={1}>
        {currentView === 'main' && (
          <Box flexDirection="column">
            <StatsDisplay
              customers={customers.length}
              projects={activeProjects}
              overdueCount={overdueInvoices.length}
              overdueAmount={overdueAmount}
            />
            <MainMenu />
          </Box>
        )}

        {currentView === 'economy' && <EconomyMenu />}
        {currentView === 'customers' && <CustomerList />}
        {currentView === 'customer-detail' && <CustomerDetail />}
        {currentView === 'invoices' && <InvoiceList />}
        {currentView === 'projects' && <ProjectList />}
      </Box>

      {/* Help Bar */}
      <HelpText commands={[
        '↑↓: Navigér',
        'Enter: Velg',
        'ESC: Tilbake',
        'Ctrl+R: Refresh',
        'Ctrl+C: Avslutt'
      ]} />
    </Box>
  );
};

export const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);
```

#### 6.2 Dashboard Entry Point

**Fil:** `src/dashboard.jsx`

```jsx
import React from 'react';
import {render} from 'ink';
import {App} from './ui/App.jsx';

// Render the app
render(<App />);
```

---

### Fase 7: Oppdater CLI Entry Point (30 min)

#### 7.1 Oppdater index.js

**Fil:** `src/index.js`

Legg til ny kommando for Ink dashboard:

```javascript
program
  .command('dashboard')
  .alias('oversikt')
  .description('Vis interaktivt dashboard')
  .option('--blessed', 'Bruk gammel Blessed UI (deprecated)')
  .action(async (options) => {
    if (options.blessed) {
      // Fallback til blessed
      console.log(chalk.yellow('⚠️  Warning: Blessed UI er deprecated og kan være ustabil'));
      const {spawn} = await import('child_process');
      spawn('node', ['src/dashboard-blessed.js'], {stdio: 'inherit'});
    } else {
      // Bruk nye Ink dashboard
      const {spawn} = await import('child_process');
      spawn('babel-node', ['src/dashboard.jsx'], {stdio: 'inherit'});
    }
  });
```

---

### Fase 8: Testing & Polish (2 timer)

#### 8.1 Manuell Testing Checklist

```markdown
## Test Plan

### Navigation
- [ ] Start dashboard med `npm run dashboard`
- [ ] Navigér gjennom hovedmeny med piltaster
- [ ] Velg "KUNDER" med Enter
- [ ] Se at kundeliste vises
- [ ] Velg en kunde og se detaljer
- [ ] Trykk ESC for å gå tilbake til kundeliste
- [ ] Trykk ESC igjen for å gå tilbake til hovedmeny
- [ ] Gå inn på "ØKONOMI"
- [ ] Velg "FAKTURAER"
- [ ] Se at fakturaer vises i tabell
- [ ] Trykk ESC to ganger for å komme tilbake til hovedmeny

### Git Sync
- [ ] Åpne to terminaler
- [ ] Start dashboard i begge
- [ ] I terminal 1: Gjør en endring via CLI (f.eks. `npm run crm kunder`)
- [ ] Se at terminal 2 oppdateres automatisk innen 30 sek
- [ ] I terminal 2: Gjør en endring
- [ ] Se at terminal 1 oppdateres

### Edge Cases
- [ ] Test med tom kundeliste
- [ ] Test med mange kunder (>100)
- [ ] Test med lange kundenavn
- [ ] Test med manglende data (null values)
- [ ] Test med nettverksfeil (disconnect WiFi)

### Performance
- [ ] Dashboard starter på <2 sekunder
- [ ] Navigation er responsiv (<100ms)
- [ ] Ingen memory leaks ved langtidskjøring
- [ ] CPU usage <10% når idle
```

#### 8.2 Error Handling

Legg til error boundaries i App.jsx:

```jsx
import React from 'react';
import {Box, Text} from 'ink';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box flexDirection="column" padding={2}>
          <Text color="red" bold>❌ Dashboard Error</Text>
          <Text>{this.state.error?.message}</Text>
          <Text dimColor>Press Ctrl+C to exit</Text>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrap App with ErrorBoundary
export const App = () => (
  <ErrorBoundary>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </ErrorBoundary>
);
```

#### 8.3 Performance Optimization

Legg til memoization hvor nødvendig:

```jsx
import React, {useMemo} from 'react';

const ExpensiveComponent = ({data}) => {
  const processedData = useMemo(() => {
    // Expensive computation
    return data.map(item => ({
      ...item,
      formatted: formatComplexData(item)
    }));
  }, [data]); // Only recompute when data changes

  return <>{/* render */}</>;
};
```

---

## Real-Time Git Sync

### Sync Strategy

```
┌──────────────────────────────────────────────────────────┐
│                  Real-Time Sync Flow                      │
└──────────────────────────────────────────────────────────┘

User A makes change via CLI
         │
         ▼
   data-manager saves to JSON
         │
         ▼
   git-sync auto commits & pushes
         │
         ▼
    GitHub (origin/main)
         │
         ▼
   GitWatcher on User B's machine polls (every 30s)
         │
         ▼
   Detects new commit
         │
         ▼
   git pull --rebase
         │
         ▼
   chokidar detects file changes
         │
         ▼
   useGitSync hook emits event
         │
         ▼
   App calls reload()
         │
         ▼
   useData hook fetches fresh data
         │
         ▼
   React re-renders with new data
         │
         ▼
   User B sees updated dashboard! 🎉
```

### Adaptive Polling

```javascript
// lib/smart-sync.js
export class SmartSync {
  getInterval() {
    const hour = new Date().getHours();

    // Working hours (9-17): check every 30s
    if (hour >= 9 && hour <= 17) return 30000;

    // Evening (7-22): check every 2 min
    if (hour >= 7 && hour <= 22) return 120000;

    // Night: check every 5 min
    return 300000;
  }

  async detectActivity() {
    // Check if colleague has commits in last 5 min
    const recent = execSync(
      'git log --since="5 minutes ago" --all',
      {encoding: 'utf-8'}
    );

    if (recent.trim()) {
      // Colleague is active - check more often
      return 15000; // 15s
    }

    return this.getInterval();
  }
}
```

### Conflict Resolution

```javascript
// lib/git-watcher.js - Enhanced checkRemote
async checkRemote() {
  try {
    execSync('git fetch origin', {cwd: this.dataDir, stdio: 'pipe'});

    const remoteCommit = execSync(
      'git rev-parse origin/main',
      {cwd: this.dataDir, encoding: 'utf-8'}
    ).trim();

    if (remoteCommit !== this.lastCommit) {
      try {
        // Try rebase
        execSync('git pull --rebase origin main', {
          cwd: this.dataDir,
          stdio: 'pipe'
        });
        this.lastCommit = remoteCommit;
        this.emit('remote-change', remoteCommit);
      } catch (pullError) {
        // Rebase failed - likely merge conflict
        if (pullError.message.includes('conflict')) {
          // Abort rebase
          execSync('git rebase --abort', {cwd: this.dataDir});

          // Notify user
          this.emit('conflict', {
            message: 'Git conflict detected. Please resolve manually.',
            error: pullError
          });
        } else {
          this.emit('error', pullError);
        }
      }
    }
  } catch (err) {
    // Network error - ignore silently
  }
}
```

### User Notification

```jsx
// In App.jsx
const [syncStatus, setSyncStatus] = useState('synced');

useGitSync((type, info) => {
  if (type === 'remote') {
    setSyncStatus('syncing');
    reload();
    setTimeout(() => setSyncStatus('synced'), 1000);
  } else if (type === 'conflict') {
    setSyncStatus('conflict');
  }
});

// In StatusBar component
<Box>
  {syncStatus === 'synced' && <Text color="green">✓ Synced</Text>}
  {syncStatus === 'syncing' && <Text color="yellow">⟳ Syncing...</Text>}
  {syncStatus === 'conflict' && <Text color="red">⚠ Conflict - resolve manually</Text>}
</Box>
```

---

## Kodeeksempler

### Før vs Etter

#### Før (Blessed) - Main Menu Handler

```javascript
// 50+ linjer med kompleks event handling
const mainMenu = blessed.list({
  top: 8,
  left: 'center',
  width: '60%',
  height: 13,
  label: ' HOVEDMENY ',
  items: ['KUNDER', 'ØKONOMI', ...],
  // ...massive config object
});

function handleMenuSelection() {
  if (mainMenu.hidden) return; // Må sjekke hidden

  const selected = mainMenu.selected;
  const item = mainMenu.getItem(selected);
  if (!item) return;

  const text = item.getText().trim().toUpperCase();

  if (text.includes('ØKONOMI')) {
    showEconomy();
  }
  // ...mange if/else
}

mainMenu.on('select', handleMenuSelection);
mainMenu.key(['enter', 'return'], handleMenuSelection); // Duplikat handler

// Mystery crashes here! 💥
```

#### Etter (Ink) - Main Menu Handler

```jsx
// 20 linjer med klar React-logikk
const MainMenu = () => {
  const {navigate} = useApp();

  const items = [
    {label: 'KUNDER', value: 'customers'},
    {label: 'ØKONOMI', value: 'economy'},
    // ...
  ];

  const handleSelect = (item) => {
    navigate(item.value);
  };

  return (
    <Box borderStyle="double" borderColor="cyan">
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
};

// Ingen crashes! ✅
```

---

## Testing Strategi

### Unit Tests (Optional)

```javascript
// __tests__/components/StatBox.test.js
import React from 'react';
import {render} from 'ink-testing-library';
import {StatBox} from '../src/ui/components/StatBox';

describe('StatBox', () => {
  it('renders label and value', () => {
    const {lastFrame} = render(
      <StatBox label="Kunder" value="93" color="green" icon="👥" />
    );

    expect(lastFrame()).toContain('👥 Kunder');
    expect(lastFrame()).toContain('93');
  });
});
```

### Integration Tests

```javascript
// __tests__/App.test.js
import React from 'react';
import {render} from 'ink-testing-library';
import {App} from '../src/ui/App';

describe('App', () => {
  it('renders main menu on start', () => {
    const {lastFrame} = render(<App />);
    expect(lastFrame()).toContain('HOVEDMENY');
  });

  it('navigates to customers on selection', async () => {
    const {lastFrame, stdin} = render(<App />);

    // Simulate arrow down
    stdin.write('\x1B[B');

    // Simulate enter
    stdin.write('\r');

    // Should show customer list
    await waitFor(() => {
      expect(lastFrame()).toContain('KUNDER');
    });
  });
});
```

---

## Rollback Plan

### Hvis Noe Går Galt

#### Quick Rollback

```bash
# Gå tilbake til Blessed dashboard
npm run crm dashboard --blessed

# Eller gjennopprett backup
cp src/dashboard-blessed.backup.js src/dashboard-blessed.js
```

#### Full Rollback

```bash
# Revert alle endringer
git checkout HEAD~1 src/

# Eller gå tilbake til spesifikk commit
git checkout <commit-hash> src/

# Reinstaller dependencies
npm install
```

### Gradvis Migrasjon

Hvis du vil migrere gradvis:

```javascript
// src/index.js
program
  .command('dashboard')
  .option('--ink', 'Use new Ink UI (beta)')
  .option('--blessed', 'Use old Blessed UI (stable)')
  .action((options) => {
    if (options.ink) {
      // New Ink UI
      spawn('babel-node', ['src/dashboard.jsx']);
    } else {
      // Old Blessed UI (default during transition)
      spawn('node', ['src/dashboard-blessed.js']);
    }
  });
```

Dette lar deg teste Ink mens du beholder Blessed som fallback.

---

## Timeline

### Dag 1 (6-8 timer)

**Morgen (3-4 timer):**
- ✅ Fase 0: Forberedelse (30 min)
- ✅ Fase 1: Grunnmur (2-3 timer)
  - Setup context, hooks, git watcher
  - Gjenbrukbare komponenter

**Ettermiddag (3-4 timer):**
- ✅ Fase 2: Main Menu (1 time)
- ✅ Fase 3: Economy Menu (1 time)
- ✅ Fase 4: List Views start (2 timer)

### Dag 2 (6-8 timer)

**Morgen (3-4 timer):**
- ✅ Fase 4: List Views ferdig (1 time)
- ✅ Fase 5: Detail Views (2 timer)

**Ettermiddag (3-4 timer):**
- ✅ Fase 6: Root App (1 time)
- ✅ Fase 7: CLI integration (30 min)
- ✅ Fase 8: Testing & Polish (2 timer)

### Total: 12-16 timer over 2 dager

**Faktisk arbeidstid:** Sannsynligvis 1.5-2 dager med pauser og uforutsette issues.

---

## Vedlegg

### A. Dependencies

```json
{
  "dependencies": {
    "ink": "^4.4.1",
    "react": "^18.2.0",
    "ink-select-input": "^5.0.0",
    "ink-table": "^3.1.0",
    "ink-spinner": "^5.0.0",
    "ink-text-input": "^5.0.1",
    "ink-box": "^3.0.0",
    "ink-gradient": "^3.0.0",
    "chokidar": "^3.5.3",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@babel/core": "^7.23.7",
    "@babel/preset-env": "^7.23.7",
    "@babel/preset-react": "^7.23.3",
    "@babel/node": "^7.22.19",
    "ink-testing-library": "^3.0.0",
    "jest": "^29.7.0"
  }
}
```

### B. Babel Config

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

### C. Package.json Scripts

```json
{
  "scripts": {
    "crm": "node src/index.js",
    "dashboard": "babel-node src/dashboard.jsx",
    "dashboard:blessed": "node src/dashboard-blessed.js",
    "dev": "nodemon --exec babel-node src/dashboard.jsx",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### D. Ink Resources

- **Docs:** https://github.com/vadimdemedes/ink
- **Examples:** https://github.com/vadimdemedes/ink/tree/master/examples
- **Components:** https://github.com/vadimdemedes/ink#components
- **Testing:** https://github.com/vadimdemedes/ink-testing-library

### E. Troubleshooting

**Problem: "Cannot find module 'react'"**
```bash
npm install react
```

**Problem: "Unexpected token '<'" (JSX syntax error)**
```bash
# Make sure babel is installed and configured
npm install --save-dev @babel/core @babel/preset-react
```

**Problem: "Terminal rendering weird characters"**
```bash
# Set terminal encoding
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

**Problem: "Git sync not working"**
```bash
# Check git remote
git remote -v

# Test git operations
git fetch origin
git pull origin main
```

---

## Neste Steg (I Morgen)

1. **Les gjennom planen**
2. **Kjør Fase 0** (installere dependencies)
3. **Start med Fase 1** (grunnmur)
4. **Test kontinuerlig** etter hver fase

**Suksesskriterier:**
- ✅ Dashboard starter uten crashes
- ✅ Kan navigere mellom views
- ✅ Data vises korrekt
- ✅ ESC key fungerer
- ✅ Git sync oppdaterer data automatisk

---

**Lykke til! 🚀**

Dette blir mye bedre enn Blessed - garantert mindre hodepine og raskere utvikling.
