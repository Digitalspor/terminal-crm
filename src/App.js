import React, { useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import { useCRMStore } from './store/index.js';
import MainMenu from './ui/views/MainMenu.js';
import CustomerList from './ui/views/CustomerList.js';
import CustomerDetail from './ui/views/CustomerDetail.js';
import InvoiceList from './ui/views/InvoiceList.js';
import EconomyMenu from './ui/views/EconomyMenu.js';

/**
 * Main CRM Application
 *
 * Router component that renders different views based on currentView state
 */
export function App() {
  const currentView = useCRMStore((state) => state.currentView);
  const refreshAll = useCRMStore((state) => state.refreshAll);
  const { exit } = useApp();

  // Load initial data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  // Handle Ctrl+C gracefully
  useEffect(() => {
    const handleExit = () => {
      exit();
    };

    process.on('SIGINT', handleExit);

    return () => {
      process.off('SIGINT', handleExit);
    };
  }, [exit]);

  // Render view based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'main-menu':
        return <MainMenu />;

      case 'customer-list':
        return <CustomerList />;

      case 'customer-detail':
        return <CustomerDetail />;

      case 'invoice-list':
        return <InvoiceList />;

      case 'economy-menu':
        return <EconomyMenu />;

      case 'project-list':
        return <ProjectListPlaceholder />;

      case 'global-search':
        return <GlobalSearchPlaceholder />;

      default:
        return (
          <Box padding={1}>
            <Text color="red">Unknown view: {currentView}</Text>
          </Box>
        );
    }
  };

  return (
    <Box flexDirection="column">
      {renderView()}
    </Box>
  );
}

/**
 * Placeholder views for not yet implemented features
 */
function ProjectListPlaceholder() {
  const goBack = useCRMStore((state) => state.goBack);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text bold color="cyan">
          PROSJEKTER
        </Text>
      </Box>
      <Text dimColor>Prosjektoversikt kommer snart...</Text>
      <Box marginTop={2}>
        <Text dimColor>Trykk Esc for å gå tilbake</Text>
      </Box>
    </Box>
  );
}

function GlobalSearchPlaceholder() {
  const goBack = useCRMStore((state) => state.goBack);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text bold color="cyan">
          GLOBAL SØK
        </Text>
      </Box>
      <Text dimColor>Global søk kommer snart...</Text>
      <Box marginTop={2}>
        <Text dimColor>Trykk Esc for å gå tilbake</Text>
      </Box>
    </Box>
  );
}

export default App;
