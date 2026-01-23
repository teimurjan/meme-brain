import type { HumorProfile, HistoryEntry } from '../types';
import { createEmptyHumorProfile, HUMOR_TYPES } from '../types';

function getDateKey(isoString: string): string {
  return isoString.split('T')[0]!;
}

export function calculateStrike(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;

  const today = getDateKey(new Date().toISOString());
  const sortedDates = history.map((h) => getDateKey(h.playedAt)).sort((a, b) => b.localeCompare(a));

  const uniqueDates = [...new Set(sortedDates)];
  if (uniqueDates.length === 0) return 0;

  const mostRecentDate = uniqueDates[0]!;
  const yesterday = getDateKey(new Date(Date.now() - 86400000).toISOString());

  if (mostRecentDate !== today && mostRecentDate !== yesterday) {
    return 0;
  }

  let strike = 0;
  let expectedDate = new Date(mostRecentDate);

  for (const dateStr of uniqueDates) {
    const expectedDateStr = getDateKey(expectedDate.toISOString());
    if (dateStr === expectedDateStr) {
      strike++;
      expectedDate = new Date(expectedDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return strike;
}

export function calculateAccumulatedProfile(history: HistoryEntry[]): HumorProfile {
  if (history.length === 0) return createEmptyHumorProfile();

  const decayFactor = 0.8;
  const accumulated = createEmptyHumorProfile();
  let totalWeight = 0;

  for (let i = 0; i < history.length; i++) {
    const weight = Math.pow(decayFactor, i);
    totalWeight += weight;

    for (const type of HUMOR_TYPES) {
      accumulated[type] += history[i]!.humorProfile[type] * weight;
    }
  }

  if (totalWeight > 0) {
    for (const type of HUMOR_TYPES) {
      accumulated[type] = Math.round((accumulated[type] / totalWeight) * 100) / 100;
    }
  }

  return accumulated;
}
