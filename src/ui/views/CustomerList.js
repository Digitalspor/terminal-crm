import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useCustomers, useCRMStore } from '../../store/index.js';
import { useScrollWithKeyboard } from '../hooks/useScroll.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import SearchBar from '../components/SearchBar.js';
import { ScrollBox } from '../design-system/ScrollBox.js';
import { HelpText } from '../design-system/HelpText.js';
import { RenderIfWindowSize } from '../design-system/RenderIfWindowSize.js';

/**
 * CustomerList - List all customers with search and navigation
 */
export function CustomerList() {
  const { customers, load, search: searchCustomers } = useCustomers();
  const setView = useCRMStore((state) => state.setView);
  const selectCustomer = useCRMStore((state) => state.selectCustomer);
  const goBack = useCRMStore((state) => state.goBack);

  const [searchQuery, setSearchQuery] = useState('');
  const { height } = useWindowSize();

  // Calculate page size based on terminal height
  const pageSize = Math.max(5, height - 15);

  useEffect(() => {
    load();
  }, []);

  // Scroll with keyboard
  const {
    selectedIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    totalItems
  } = useScrollWithKeyboard(customers, pageSize, {
    onSelect: (customer) => {
      selectCustomer(customer.id);
      setView('customer-detail');
    },
    onEscape: () => {
      goBack();
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchCustomers(query);
    } else {
      load();
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          KUNDER
        </Text>
        <Text dimColor> ({customers.length} kunder)</Text>
      </Box>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Søk kunder..."
        showResultCount={searchQuery.length > 0}
        resultCount={customers.length}
      />

      {/* Customer List */}
      {customers.length === 0 ? (
        <Box marginTop={2}>
          <Text dimColor>
            {searchQuery.length > 0 ? 'Ingen kunder funnet' : 'Laster kunder...'}
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
          {visibleItems.map((customer, idx) => {
            const isSelected = idx + (selectedIndex - (selectedIndex % pageSize)) === selectedIndex;
            return (
              <CustomerListItem
                key={customer.id}
                customer={customer}
                isSelected={isSelected}
              />
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
 * CustomerListItem - Single customer in the list
 */
function CustomerListItem({ customer, isSelected }) {
  const { width } = useWindowSize();

  // Responsive layout based on terminal width
  const showFullDetails = width >= 100;
  const showMediumDetails = width >= 80 && width < 100;

  return (
    <Box marginBottom={0}>
      <Box width="100%">
        {/* Selection indicator */}
        <Box width={2}>
          <Text color={isSelected ? 'cyan' : 'gray'}>
            {isSelected ? '▶' : ' '}
          </Text>
        </Box>

        {/* Customer name */}
        <Box width={showFullDetails ? 30 : 25} flexShrink={0}>
          <Text
            color={isSelected ? 'cyan' : 'white'}
            bold={isSelected}
            wrap="truncate"
          >
            {customer.name}
          </Text>
        </Box>

        {/* Contact info - hide on small screens */}
        <RenderIfWindowSize minWidth={80}>
          <Box width={showFullDetails ? 25 : 20} flexShrink={0} marginLeft={2}>
            <Text dimColor wrap="truncate">
              {customer.contact_name || customer.contact_email || '-'}
            </Text>
          </Box>
        </RenderIfWindowSize>

        {/* City - only on large screens */}
        <RenderIfWindowSize minWidth={100}>
          <Box width={15} flexShrink={0} marginLeft={2}>
            <Text dimColor wrap="truncate">
              {customer.address_city || '-'}
            </Text>
          </Box>
        </RenderIfWindowSize>

        {/* Org number - only on large screens */}
        <RenderIfWindowSize minWidth={120}>
          <Box width={12} flexShrink={0} marginLeft={2}>
            <Text dimColor wrap="truncate">
              {customer.org_nr || '-'}
            </Text>
          </Box>
        </RenderIfWindowSize>
      </Box>
    </Box>
  );
}

export default CustomerList;
