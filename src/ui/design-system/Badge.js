import React from 'react';
import { Box, Text } from 'ink';

/**
 * Badge component - Small colored label
 *
 * Props:
 * - children: badge text
 * - color: badge color (default: 'gray')
 * - variant: style variant ('default' | 'success' | 'warning' | 'error' | 'info')
 */
export function Badge({ children, color, variant = 'default' }) {
  // Map variants to colors
  const variantColors = {
    default: 'gray',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'cyan',
    primary: 'blue'
  };

  const badgeColor = color || variantColors[variant] || 'gray';

  return (
    <Box>
      <Text color={badgeColor} bold>
        [{children}]
      </Text>
    </Box>
  );
}

/**
 * StatusBadge - Badge for status indicators
 *
 * Auto-maps common statuses to colors:
 * - draft: gray
 * - sent: yellow
 * - paid: green
 * - in-progress: cyan
 * - completed: green
 * - on-hold: yellow
 * - overdue: red
 */
export function StatusBadge({ status }) {
  const statusColors = {
    draft: 'gray',
    sent: 'yellow',
    paid: 'green',
    'in-progress': 'cyan',
    completed: 'green',
    'on-hold': 'yellow',
    overdue: 'red',
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
    approved: 'green',
    rejected: 'red'
  };

  const color = statusColors[status.toLowerCase()] || 'gray';

  return <Badge color={color}>{status}</Badge>;
}

/**
 * CountBadge - Badge with a number
 */
export function CountBadge({ count, variant = 'default' }) {
  return <Badge variant={variant}>{count}</Badge>;
}

export default Badge;
