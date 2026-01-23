#!/usr/bin/env node

/**
 * Verifies devvit.json has placeholders (not real values)
 * Used as pre-commit hook
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEVVIT_PATH = resolve(ROOT, 'devvit.json');

const PLACEHOLDERS = ['DEVVIT_APP_NAME', 'DEVVIT_DEV_SUBREDDIT'];

function main() {
  const devvit = readFileSync(DEVVIT_PATH, 'utf-8');

  const missing = [];
  for (const key of PLACEHOLDERS) {
    if (!devvit.includes(`{{${key}}}`)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('Error: devvit.json contains real values instead of placeholders');
    console.error('Missing placeholders:', missing.map((k) => `{{${k}}}`).join(', '));
    console.error('');
    console.error('Run: node tools/reset-devvit.js');
    process.exit(1);
  }

  console.log('devvit.json has all placeholders');
}

main();
