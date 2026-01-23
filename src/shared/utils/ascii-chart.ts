import type { HumorProfile } from '../types';
import { HUMOR_TYPES } from '../types';

const HUMOR_LABELS: Record<(typeof HUMOR_TYPES)[number], string> = {
  absurdist: 'ABS',
  sarcastic: 'SAR',
  wholesome: 'WHO',
  unhinged: 'UNH',
  deadpan: 'DEA',
};

const BAR_LENGTH = 10;
const FILLED = '\u2588';
const EMPTY = '\u2591';

export function generateAsciiChart(profile: HumorProfile): string {
  const lines: string[] = [];

  for (const type of HUMOR_TYPES) {
    const value = profile[type];
    const percentage = Math.round(value * 100);
    const filledCount = Math.round(value * BAR_LENGTH);
    const emptyCount = BAR_LENGTH - filledCount;

    const bar = FILLED.repeat(filledCount) + EMPTY.repeat(emptyCount);
    const label = HUMOR_LABELS[type];
    const percentStr = `${percentage}%`.padStart(4);

    lines.push(`${label} ${bar} ${percentStr}`);
  }

  return `\`\`\`
${lines.join('\n')}
\`\`\``;
}
