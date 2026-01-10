import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useCRMStore } from '../../store/index.js';
import { useScrollWithKeyboard } from '../hooks/useScroll.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import { ScrollBox } from '../design-system/ScrollBox.js';
import { HelpText } from '../design-system/HelpText.js';
import { RenderIfWindowSize } from '../design-system/RenderIfWindowSize.js';

/**
 * CustomerList - List all customers with search and navigation
 */
export function CustomerList() {
  const customers = useCRMStore((state) => state.customers);
  const loadCustomers = useCRMStore((state) => state.loadCustomers);
  const searchCustomers = useCRMStore((state) => state.searchCustomers);
  const setView = useCRMStore((state) => state.setView);
  const selectCustomer = useCRMStore((state) => state.selectCustomer);
  const goBack = useCRMStore((state) => state.goBack);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { height } = useWindowSize();
  const hasLoadedRef = useRef(false);

  // Calculate page size based on terminal height
  const pageSize = Math.max(5, height - 15);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadCustomers();
    }
  }, [loadCustomers]);

  // Scroll with keyboard - disabled when searching
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
      if (isSearching) {
        setIsSearching(false);
        setSearchQuery('');
        loadCustomers();
      } else {
        goBack();
      }
    },
    disabled: isSearching
  });

  // Handle '/' key to activate search
  useInput((input, key) => {
    if (!isSearching && input === '/') {
      setIsSearching(true);
    }
  }, { isActive: !isSearching });

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchCustomers(query);
    } else {
      loadCustomers();
    }
  };

  const handleSearchSubmit = () => {
    setIsSearching(false);
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

      {/* Search bar - only shown when searching */}
      {isSearching ? (
        <Box marginBottom={1}>
          <Text color="cyan">/</Text>
          <TextInput
            value={searchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder="Søk kunder..."
          />
          {searchQuery.length > 0 && (
            <Text dimColor> ({customers.length} treff)</Text>
          )}
        </Box>
      ) : (
        searchQuery.length > 0 && (
          <Box marginBottom={1}>
            <Text dimColor>Søk: "{searchQuery}" ({customers.length} treff)</Text>
          </Box>
        )
      )}

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
