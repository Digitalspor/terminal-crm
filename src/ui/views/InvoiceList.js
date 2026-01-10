import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useInvoices, useCRMStore } from '../../store/index.js';
import { useScrollWithKeyboard } from '../hooks/useScroll.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import SearchBar from '../components/SearchBar.js';
import { ScrollBox } from '../design-system/ScrollBox.js';
import { StatusBadge } from '../design-system/Badge.js';
import { HelpText } from '../design-system/HelpText.js';
import { RenderIfWindowSize } from '../design-system/RenderIfWindowSize.js';

/**
 * InvoiceList - List all invoices with search and filtering
 */
export function InvoiceList() {
  const { invoices, load, search: searchInvoices, getOverdue } = useInvoices();
  const goBack = useCRMStore((state) => state.goBack);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(null); // 'draft', 'sent', 'paid', 'overdue'
  const { height } = useWindowSize();

  const pageSize = Math.max(5, height - 15);

  useEffect(() => {
    load();
  }, []);

  const {
    selectedIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    totalItems
  } = useScrollWithKeyboard(invoices, pageSize, {
    onSelect: (invoice) => {
      // TODO: Navigate to invoice detail
      console.log('Selected invoice:', invoice);
    },
    onEscape: () => {
      goBack();
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchInvoices(query, { status: filterStatus });
    } else {
      if (filterStatus === 'overdue') {
        getOverdue();
      } else {
        load();
      }
    }
  };

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const overdueCount = invoices.filter(
    (inv) => inv.status !== 'paid' && new Date(inv.due_date) < new Date()
  ).length;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          FAKTURAER
        </Text>
        <Text dimColor> ({invoices.length} fakturaer)</Text>
      </Box>

      {/* Stats bar */}
      <Box marginBottom={1} justifyContent="space-between">
        <Box>
          <Text dimColor>Totalt: </Text>
          <Text bold>{(totalAmount / 100).toLocaleString('nb-NO')} kr</Text>
        </Box>
        {overdueCount > 0 && (
          <Box>
            <Text color="red">Forfalte: </Text>
            <Text color="red" bold>
              {overdueCount}
            </Text>
          </Box>
        )}
      </Box>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Søk fakturaer..."
        showResultCount={searchQuery.length > 0}
        resultCount={invoices.length}
      />

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <Box marginTop={2}>
          <Text dimColor>
            {searchQuery.length > 0 ? 'Ingen fakturaer funnet' : 'Laster fakturaer...'}
          </Text>
        </Box>
      ) : (
        <ScrollBox
          height={pageSize}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
          currentIndex={selectedIndex}
          totalItems={totalItems}
        >
          {visibleItems.map((invoice, idx) => {
            const isSelected = idx + (selectedIndex - (selectedIndex % pageSize)) === selectedIndex;
            return (
              <InvoiceListItem key={invoice.id} invoice={invoice} isSelected={isSelected} />
            );
          })}
        </ScrollBox>
      )}

      {/* Help text */}
      <HelpText>
        ↑↓: Naviger • Enter: Se detaljer • /: Søk • Esc: Tilbake
      </HelpText>
    </Box>
  );
}

/**
 * InvoiceListItem - Single invoice in the list
 */
function InvoiceListItem({ invoice, isSelected }) {
  const { width } = useWindowSize();

  const showFullDetails = width >= 100;
  const showMediumDetails = width >= 80 && width < 100;

  // Check if overdue
  const isOverdue =
    invoice.status !== 'paid' && new Date(invoice.due_date) < new Date();

  return (
    <Box marginBottom={0}>
      <Box width="100%">
        {/* Selection indicator */}
        <Box width={2}>
          <Text color={isSelected ? 'cyan' : 'gray'}>
            {isSelected ? '▶' : ' '}
          </Text>
        </Box>

        {/* Invoice number */}
        <Box width={12} flexShrink={0}>
          <Text
            color={isSelected ? 'cyan' : isOverdue ? 'red' : 'white'}
            bold={isSelected || isOverdue}
            wrap="truncate"
          >
            #{invoice.invoice_number}
          </Text>
        </Box>

        {/* Customer name */}
        <Box width={showFullDetails ? 25 : 20} flexShrink={0} marginLeft={2}>
          <Text
            color={isSelected ? 'cyan' : 'white'}
            wrap="truncate"
          >
            {invoice.customer_name}
          </Text>
        </Box>

        {/* Status */}
        <Box width={10} flexShrink={0} marginLeft={2}>
          <StatusBadge status={invoice.status} />
        </Box>

        {/* Date - hide on small screens */}
        <RenderIfWindowSize minWidth={80}>
          <Box width={12} flexShrink={0} marginLeft={2}>
            <Text dimColor wrap="truncate">
              {invoice.date}
            </Text>
          </Box>
        </RenderIfWindowSize>

        {/* Due date - only on large screens */}
        <RenderIfWindowSize minWidth={100}>
          <Box width={12} flexShrink={0} marginLeft={2}>
            <Text dimColor={!isOverdue} color={isOverdue ? 'red' : undefined} wrap="truncate">
              {invoice.due_date}
            </Text>
          </Box>
        </RenderIfWindowSize>

        {/* Amount */}
        <Box marginLeft={2} justifyContent="flex-end" flexGrow={1}>
          <Text
            color={isSelected ? 'cyan' : 'white'}
            bold={isSelected}
          >
            {(invoice.total / 100).toLocaleString('nb-NO')} kr
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default InvoiceList;
