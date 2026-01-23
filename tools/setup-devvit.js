#!/usr/bin/env node

/**
 * Replaces placeholders in devvit.json with values from .env
 * Run: node tools/setup-devvit.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEVVIT_PATH = resolve(ROOT, 'devvit.json');
const ENV_PATH = resolve(ROOT, '.env');

const PLACEHOLDERS = ['DEVVIT_APP_NAME', 'DEVVIT_DEV_SUBREDDIT'];

function parseEnv(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

function main() {
  if (!existsSync(ENV_PATH)) {
    console.error('Error: .env file not found');
    console.error('Copy .env.template to .env and fill in your values');
    process.exit(1);
  }

  const env = parseEnv(readFileSync(ENV_PATH, 'utf-8'));
  let devvit = readFileSync(DEVVIT_PATH, 'utf-8');

  const missing = [];
  for (const key of PLACEHOLDERS) {
    if (!env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('Error: Missing environment variables:', missing.join(', '));
    process.exit(1);
  }

  for (const key of PLACEHOLDERS) {
    devvit = devvit.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), env[key]);
  }

  writeFileSync(DEVVIT_PATH, devvit);
  console.log('devvit.json updated with values from .env');
}

main();
