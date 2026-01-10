import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { useStats, useCRMStore } from '../../store/index.js';
import { Card, CardRow } from '../design-system/Card.js';
import { HelpText } from '../design-system/HelpText.js';

/**
 * EconomyMenu - Economy reports and statistics
 */
export function EconomyMenu() {
  const { stats, load: loadStats } = useStats();
  const goBack = useCRMStore((state) => state.goBack);

  useEffect(() => {
    loadStats();
  }, []);

  const menuItems = [
    {
      label: 'INNTEKTER',
      value: 'revenue',
      description: 'Inntektsrapport'
    },
    {
      label: 'FORFALTE',
      value: 'overdue',
      description: 'Forfalte fakturaer'
    },
    {
      label: 'TILBAKE',
      value: 'back',
      description: 'Tilbake til hovedmeny'
    }
  ];

  const handleSelect = (item) => {
    if (item.value === 'back') {
      goBack();
    } else if (item.value === 'overdue') {
      // TODO: Navigate to overdue invoices
      console.log('Show overdue invoices');
    } else if (item.value === 'revenue') {
      // TODO: Navigate to revenue report
      console.log('Show revenue report');
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
          ØKONOMI
        </Text>
      </Box>

      {/* Stats Overview */}
      {stats && (
        <Box flexDirection="column" marginBottom={2}>
          <Card title="Oversikt" marginBottom={1}>
            <CardRow
              label="Totalt fakturert"
              value={stats.total_revenue ? `${(stats.total_revenue / 100).toLocaleString('nb-NO')} kr` : '-'}
              valueColor="green"
            />
            <CardRow
              label="Utestående"
              value={stats.outstanding_invoices ? `${(stats.outstanding_invoices / 100).toLocaleString('nb-NO')} kr` : '-'}
              valueColor="yellow"
            />
            <CardRow
              label="Forfalte fakturaer"
              value={stats.overdue_count ? stats.overdue_count.toString() : '0'}
              valueColor={stats.overdue_count > 0 ? 'red' : 'green'}
            />
          </Card>

          <Card title="Aktivitet">
            <CardRow label="Antall kunder" value={stats.total_customers.toString()} />
            <CardRow label="Antall fakturaer" value={stats.total_invoices.toString()} />
            <CardRow label="Antall prosjekter" value={stats.total_projects.toString()} />
          </Card>
        </Box>
      )}

      {/* Menu */}
      <SelectInput
        items={menuItems}
        onSelect={handleSelect}
        itemComponent={itemComponent}
        indicatorComponent={indicatorComponent}
      />

      {/* Help text */}
      <HelpText>↑↓: Naviger • Enter: Velg • Esc: Tilbake</HelpText>
    </Box>
  );
}

export default EconomyMenu;
