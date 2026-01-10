import React from 'react';
import { Box, Text } from 'ink';

/**
 * ScrollBox - Twilio SIGNAL CLI inspired scrollable container
 *
 * Shows scrollbar indicators when content overflows
 * Displays scroll position and keyboard hints
 *
 * Props:
 * - children: content to display
 * - height: max height in lines (default: 10)
 * - canScrollUp: boolean - can scroll up
 * - canScrollDown: boolean - can scroll down
 * - currentIndex: current selected index
 * - totalItems: total number of items
 * - showScrollbar: show scrollbar (default: true)
 * - showHelp: show keyboard help (default: true)
 */
export function ScrollBox({
  children,
  height = 10,
  canScrollUp = false,
  canScrollDown = false,
  currentIndex = 0,
  totalItems = 0,
  showScrollbar = true,
  showHelp = true
}) {
  return (
    <Box flexDirection="column">
      {/* Top scroll indicator */}
      {showScrollbar && canScrollUp && (
        <Box justifyContent="center" marginBottom={0}>
          <Text color="cyan" dimColor>
            ▲ More above
          </Text>
        </Box>
      )}

      {/* Content */}
      <Box flexDirection="column" minHeight={height}>
        {children}
      </Box>

      {/* Bottom scroll indicator */}
      {showScrollbar && canScrollDown && (
        <Box justifyContent="center" marginTop={0}>
          <Text color="cyan" dimColor>
            ▼ More below
          </Text>
        </Box>
      )}

      {/* Status bar with position and help */}
      {(showScrollbar || showHelp) && totalItems > 0 && (
        <Box marginTop={1} justifyContent="space-between">
          {showScrollbar && (
            <Text dimColor>
              {currentIndex + 1}/{totalItems}
            </Text>
          )}
          {showHelp && (
            <Text dimColor>
              ↑↓: Navigate • Enter: Select • Esc: Back
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

/**
 * ScrollBoxSimple - Minimal version without status bar
 */
export function ScrollBoxSimple({
  children,
  height = 10,
  canScrollUp = false,
  canScrollDown = false
}) {
  return (
    <Box flexDirection="column">
      {canScrollUp && (
        <Box justifyContent="center">
          <Text dimColor>⋮</Text>
        </Box>
      )}

      <Box flexDirection="column" minHeight={height}>
        {children}
      </Box>

      {canScrollDown && (
        <Box justifyContent="center">
          <Text dimColor>⋮</Text>
        </Box>
      )}
    </Box>
  );
}

export default ScrollBox;
