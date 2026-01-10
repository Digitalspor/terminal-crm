import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { useCRMStore, useStats } from '../../store/index.js';
import { Card } from '../design-system/Card.js';
import { HelpText } from '../design-system/HelpText.js';

/**
 * MainMenu - Main navigation menu
 */
export function MainMenu() {
  const setView = useCRMStore((state) => state.setView);
  const { stats, load: loadStats } = useStats();

  useEffect(() => {
    loadStats();
  }, []);

  const menuItems = [
    {
      label: 'KUNDER',
      value: 'customers',
      description: stats ? `${stats.total_customers} kunder` : 'Se alle kunder'
    },
    {
      label: 'FAKTURAER',
      value: 'invoices',
      description: stats
        ? `${stats.total_invoices} fakturaer (${stats.overdue_count} forfalt)`
        : 'Se alle fakturaer'
    },
    {
      label: 'PROSJEKTER',
      value: 'projects',
      description: stats ? `${stats.total_projects} prosjekter` : 'Se alle prosjekter'
    },
    {
      label: 'ØKONOMI',
      value: 'economy',
      description: 'Rapporter og statistikk'
    },
    {
      label: 'SØØK',
      value: 'search',
      description: 'Søk i alle data'
    },
    {
      label: 'AVSLUTT',
      value: 'exit',
      description: 'Avslutt CRM'
    }
  ];

  const handleSelect = (item) => {
    if (item.value === 'exit') {
      process.exit(0);
    } else if (item.value === 'customers') {
      setView('customer-list');
    } else if (item.value === 'invoices') {
      setView('invoice-list');
    } else if (item.value === 'projects') {
      setView('project-list');
    } else if (item.value === 'economy') {
      setView('economy-menu');
    } else if (item.value === 'search') {
      setView('global-search');
    }
  };

  const itemComponent = ({ label, isSelected }) => (
    <Box>
      <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
        {isSelected ? '▶ ' : '  '}
        {label}
      </Text>
    </Box>
  );

  const indicatorComponent = () => null;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="cyan">
          CRM TERMINAL
        </Text>
      </Box>

      {/* Stats Overview */}
      {stats && (
        <Card title="Oversikt" marginBottom={2}>
          <Box flexDirection="column">
            <Box justifyContent="space-between">
              <Text dimColor>Kunder:</Text>
              <Text>{stats.total_customers}</Text>
            </Box>
            <Box justifyContent="space-between">
              <Text dimColor>Fakturaer:</Text>
              <Text>{stats.total_invoices}</Text>
            </Box>
            <Box justifyContent="space-between">
              <Text dimColor>Prosjekter:</Text>
              <Text>{stats.total_projects}</Text>
            </Box>
            {stats.overdue_count > 0 && (
              <Box justifyContent="space-between" marginTop={1}>
                <Text color="red">Forfalte fakturaer:</Text>
                <Text color="red" bold>
                  {stats.overdue_count}
                </Text>
              </Box>
            )}
            {stats.outstanding_invoices > 0 && (
              <Box justifyContent="space-between">
                <Text dimColor>Utestående:</Text>
                <Text>{(stats.outstanding_invoices / 100).toLocaleString('nb-NO')} kr</Text>
              </Box>
            )}
          </Box>
        </Card>
      )}

      {/* Menu */}
      <SelectInput
        items={menuItems}
        onSelect={handleSelect}
        itemComponent={itemComponent}
        indicatorComponent={indicatorComponent}
      />

      {/* Help text */}
      <HelpText marginTop={2}>↑↓: Naviger • Enter: Velg • Ctrl+C: Avslutt</HelpText>
    </Box>
  );
}

export default MainMenu;
