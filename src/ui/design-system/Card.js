import React from 'react';
import { Box, Text } from 'ink';

/**
 * Card component - Container with border and optional title
 *
 * Props:
 * - title: card title (optional)
 * - children: card content
 * - borderColor: border color (default: 'gray')
 * - padding: internal padding (default: 1)
 * - marginTop: top margin (default: 0)
 * - marginBottom: bottom margin (default: 1)
 * - highlight: highlight the card (default: false)
 */
export function Card({
  title,
  children,
  borderColor = 'gray',
  padding = 1,
  marginTop = 0,
  marginBottom = 1,
  highlight = false
}) {
  const actualBorderColor = highlight ? 'cyan' : borderColor;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={actualBorderColor}
      paddingX={padding}
      paddingY={0}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {title && (
        <Box marginBottom={1}>
          <Text bold color={highlight ? 'cyan' : 'white'}>
            {title}
          </Text>
        </Box>
      )}
      {children}
    </Box>
  );
}

/**
 * CardRow - Single row in a card with label and value
 *
 * Props:
 * - label: left-side label
 * - value: right-side value
 * - labelColor: color for label (default: 'gray')
 * - valueColor: color for value (default: 'white')
 * - dimLabel: dim the label (default: true)
 */
export function CardRow({
  label,
  value,
  labelColor = 'gray',
  valueColor = 'white',
  dimLabel = true
}) {
  return (
    <Box justifyContent="space-between" marginBottom={0}>
      <Box marginRight={2}>
        <Text color={labelColor} dimColor={dimLabel}>
          {label}:
        </Text>
      </Box>
      <Text color={valueColor}>{value}</Text>
    </Box>
  );
}

/**
 * CardSection - Section within a card
 *
 * Props:
 * - title: section title
 * - children: section content
 * - marginTop: top margin (default: 1)
 */
export function CardSection({ title, children, marginTop = 1 }) {
  return (
    <Box flexDirection="column" marginTop={marginTop}>
      {title && (
        <Box marginBottom={0}>
          <Text bold dimColor>
            {title}
          </Text>
        </Box>
      )}
      <Box flexDirection="column">{children}</Box>
    </Box>
  );
}

export default Card;
