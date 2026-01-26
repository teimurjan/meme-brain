import type { HumorProfile, HistoryEntry } from '../types';
import { createEmptyHumorProfile, HUMOR_TYPES } from '../types';
import { getCycleKey } from './date';

export function calculateStrike(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;

  const currentCycle = getCycleKey(new Date());
  const sortedCycles = history
    .map((h) => getCycleKey(new Date(h.playedAt)))
    .sort((a, b) => b.localeCompare(a));

  const uniqueCycles = [...new Set(sortedCycles)];
  if (uniqueCycles.length === 0) return 0;

  const mostRecentCycle = uniqueCycles[0]!;

  // Calculate previous cycle key
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const previousCycle = getCycleKey(yesterday);

  // Must have played in current or previous cycle to have an active streak
  if (mostRecentCycle !== currentCycle && mostRecentCycle !== previousCycle) {
    return 0;
  }

  let strike = 0;
  const expectedCycleDate = new Date(mostRecentCycle + 'T12:00:00Z');

  for (const cycleStr of uniqueCycles) {
    const expectedCycleStr = getCycleKey(expectedCycleDate);
    if (cycleStr === expectedCycleStr) {
      strike++;
      expectedCycleDate.setUTCDate(expectedCycleDate.getUTCDate() - 1);
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
