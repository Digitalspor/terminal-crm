import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

/**
 * SearchBar component with real-time search
 *
 * Props:
 * - onSearch: (query) => void - Called when search query changes
 * - placeholder: string - Placeholder text
 * - initialValue: string - Initial search value
 * - onChange: (value) => void - Called on every keystroke
 * - showResultCount: boolean - Show number of results
 * - resultCount: number - Number of results to display
 */
export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  onChange,
  showResultCount = false,
  resultCount = 0
}) {
  const [query, setQuery] = useState(initialValue);

  const handleChange = (value) => {
    setQuery(value);
    if (onChange) {
      onChange(value);
    }
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color="cyan" bold>
          🔍{' '}
        </Text>
        <Box flexGrow={1}>
          <TextInput
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
          />
        </Box>
      </Box>
      {showResultCount && (
        <Box marginTop={0}>
          <Text dimColor>
            {resultCount === 0 && query.length > 0 && 'No results found'}
            {resultCount > 0 && `${resultCount} result${resultCount === 1 ? '' : 's'}`}
            {resultCount === 0 && query.length === 0 && 'Type to search...'}
          </Text>
        </Box>
      )}
    </Box>
  );
}

/**
 * SearchBarWithFilters - Advanced search bar with filter options
 *
 * Props:
 * - onSearch: (query, filters) => void
 * - filters: { label, value, options }[] - Array of filter definitions
 * - placeholder: string
 */
export function SearchBarWithFilters({
  onSearch,
  filters = [],
  placeholder = 'Search...'
}) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery, activeFilters);
    }
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <SearchBar
        onSearch={handleSearch}
        placeholder={placeholder}
        initialValue={query}
      />
      {filters.length > 0 && (
        <Box marginTop={1}>
          <Text dimColor>Filters: </Text>
          {filters.map((filter, idx) => (
            <Box key={idx} marginLeft={1}>
              <Text>{filter.label}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SearchBar;
