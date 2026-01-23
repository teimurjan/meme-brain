export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getTodayDateKey(): string {
  return getDateKey(new Date());
}

export function getNextResetTime(): Date {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return tomorrow;
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
