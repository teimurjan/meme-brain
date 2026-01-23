#!/usr/bin/env node

/**
 * Resets devvit.json back to placeholders
 * Run: node tools/reset-devvit.js
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
  let devvit = readFileSync(DEVVIT_PATH, 'utf-8');

  // If .env exists, replace actual values with placeholders
  if (existsSync(ENV_PATH)) {
    const env = parseEnv(readFileSync(ENV_PATH, 'utf-8'));

    for (const key of PLACEHOLDERS) {
      if (env[key]) {
        devvit = devvit.replace(new RegExp(escapeRegex(env[key]), 'g'), `{{${key}}}`);
      }
    }
  }

  writeFileSync(DEVVIT_PATH, devvit);
  console.log('devvit.json reset to placeholders');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
