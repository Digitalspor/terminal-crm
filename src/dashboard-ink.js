#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './App.js';

/**
 * CRM Terminal Dashboard
 *
 * New Ink-based dashboard with:
 * - SQLite database with FTS5 search
 * - Zustand state management
 * - Responsive terminal UI
 * - Design system components
 */

// Render the app
const { waitUntilExit } = render(<App />);

// Wait for app to exit
waitUntilExit().then(() => {
  console.log('👋 Takk for nå!');
  process.exit(0);
});
