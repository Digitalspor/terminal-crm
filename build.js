import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure dist directory exists
mkdirSync('dist', { recursive: true });

await esbuild.build({
  entryPoints: ['src/dashboard-ink.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/dashboard.js',
  external: [
    'ink',
    'react',
    'ink-*',
    'better-sqlite3',
    'fuse.js',
    'zustand'
  ],
  loader: {
    '.js': 'jsx'
  },
  jsx: 'automatic'
});

// Copy schema.sql to dist
copyFileSync('src/db/schema.sql', 'dist/schema.sql');

console.log('✅ Dashboard built successfully!');
