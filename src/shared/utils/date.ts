const RESET_HOUR_UTC = 12; // 12:00 UTC (noon)

/**
 * Get the current cycle key. Cycles reset at 12:00 UTC daily.
 * Returns format: YYYY-MM-DD (the date when this cycle started)
 */
export function getCycleKey(date: Date = new Date()): string {
  const utcHours = date.getUTCHours();

  // If before noon UTC, we're still in yesterday's cycle
  if (utcHours < RESET_HOUR_UTC) {
    const yesterday = new Date(date);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return yesterday.toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

/**
 * @deprecated Use getCycleKey instead for reset-aligned keys
 */
export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getTodayDateKey(): string {
  return getDateKey(new Date());
}

export function getNextResetTime(): Date {
  const now = new Date();
  const todayNoonUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC, 0, 0, 0)
  );

  // If we're past noon UTC, next reset is tomorrow at noon
  if (now.getTime() >= todayNoonUTC.getTime()) {
    todayNoonUTC.setUTCDate(todayNoonUTC.getUTCDate() + 1);
  }

  return todayNoonUTC;
}

export function getLastResetTime(): Date {
  const now = new Date();
  const todayNoonUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC, 0, 0, 0)
  );

  // If we're before noon UTC, last reset was yesterday at noon
  if (now.getTime() < todayNoonUTC.getTime()) {
    todayNoonUTC.setUTCDate(todayNoonUTC.getUTCDate() - 1);
  }

  return todayNoonUTC;
}

export function getTimeUntilReset(): number {
  return getNextResetTime().getTime() - Date.now();
}

export function formatTimeUntilReset(): string {
  const ms = getTimeUntilReset();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function isConsecutiveCycle(previousPlayedAt: string, currentPlayedAt: string): boolean {
  const prevCycle = getCycleKey(new Date(previousPlayedAt));
  const currCycle = getCycleKey(new Date(currentPlayedAt));

  const prevDate = new Date(prevCycle + 'T12:00:00Z');
  const currDate = new Date(currCycle + 'T12:00:00Z');
  const diffMs = currDate.getTime() - prevDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays === 1;
}

/**
 * @deprecated Use isConsecutiveCycle instead
 */
export function isConsecutiveDay(previous: string, current: string): boolean {
  const prevDate = new Date(previous + 'T00:00:00Z');
  const currDate = new Date(current + 'T00:00:00Z');
  const diffMs = currDate.getTime() - prevDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

export function generateSeed(dateKey: string): string {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    const char = dateKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function formatAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
}

export function formatDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
