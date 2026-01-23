import { generateAsciiChart } from './ascii-chart';
import type { HumorProfile } from '../types';

const REDDIT_INTROS = [
  'Meme Brain has diagnosed you as',
  'Least deranged',
  'Average',
  'Certified',
  'POV: you are',
  'Meme Brain says you have',
] as const;

function getRandomIntro(label: string): string {
  const index = Math.abs(label.charCodeAt(0) + label.length) % REDDIT_INTROS.length;
  const intro = REDDIT_INTROS[index]!;

  if (intro === 'Least deranged' || intro === 'Average' || intro === 'Certified') {
    return `${intro} **${label}**`;
  }
  if (intro === 'POV: you are') {
    return `${intro} **${label}**`;
  }
  if (intro === 'Meme Brain says you have') {
    return `${intro} **${label}** energy`;
  }
  return `${intro}: **${label}**`;
}

export function formatShareText(
  label: string,
  roast: string,
  profile: HumorProfile,
  strike: number
): string {
  const chart = generateAsciiChart(profile);
  const intro = getRandomIntro(label);
  const strikeText = strike >= 3 ? ` | ${strike}-day streak 🔥` : '';

  return `**Meme Brain**${strikeText}

${intro}

> *"${roast}"*

${chart}
`;
}
