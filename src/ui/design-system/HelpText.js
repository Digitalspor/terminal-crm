import React from 'react';
import { Box, Text } from 'ink';

/**
 * HelpText - Contextual help text component
 *
 * Props:
 * - children: help text content
 * - marginTop: top margin (default: 1)
 * - marginBottom: bottom margin (default: 0)
 */
export function HelpText({ children, marginTop = 1, marginBottom = 0 }) {
  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Text dimColor>{children}</Text>
    </Box>
  );
}

/**
 * KeyboardShortcut - Display keyboard shortcut
 *
 * Props:
 * - keys: array of keys (e.g., ['Ctrl', 'C'])
 * - description: what the shortcut does
 */
export function KeyboardShortcut({ keys, description }) {
  return (
    <Box>
      <Box marginRight={2}>
        {keys.map((key, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <Text dimColor> + </Text>
            )}
            <Text color="cyan" bold>
              {key}
            </Text>
          </React.Fragment>
        ))}
      </Box>
      <Text dimColor>{description}</Text>
    </Box>
  );
}

/**
 * KeyboardShortcuts - List of keyboard shortcuts
 *
 * Props:
 * - shortcuts: array of { keys, description }
 * - title: section title (optional)
 */
export function KeyboardShortcuts({ shortcuts = [], title = 'Keyboard Shortcuts' }) {
  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold dimColor>
            {title}
          </Text>
        </Box>
      )}
      {shortcuts.map((shortcut, idx) => (
        <Box key={idx} marginBottom={0}>
          <KeyboardShortcut keys={shortcut.keys} description={shortcut.description} />
        </Box>
      ))}
    </Box>
  );
}

/**
 * InfoBox - Informational message box
 *
 * Props:
 * - children: message content
 * - variant: 'info' | 'success' | 'warning' | 'error'
 */
export function InfoBox({ children, variant = 'info' }) {
  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗'
  };

  const colors = {
    info: 'cyan',
    success: 'green',
    warning: 'yellow',
    error: 'red'
  };

  const icon = icons[variant] || icons.info;
  const color = colors[variant] || colors.info;

  return (
    <Box marginY={1}>
      <Box marginRight={1}>
        <Text color={color}>{icon}</Text>
      </Box>
      <Text dimColor>{children}</Text>
    </Box>
  );
}

export default HelpText;
