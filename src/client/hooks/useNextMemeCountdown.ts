import { useEffect, useState } from 'react';

const RESET_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getNextResetTime(): number {
  const now = Date.now();
  const todayMidnightUTC = new Date();
  todayMidnightUTC.setUTCHours(0, 0, 0, 0);

  let nextReset = todayMidnightUTC.getTime();

  // Find the next reset (00:00 or 12:00 UTC)
  while (nextReset <= now) {
    nextReset += RESET_INTERVAL_MS;
  }

  return nextReset;
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'any moment now';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function useNextMemeCountdown(): string {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const nextReset = getNextResetTime();
    return formatTimeRemaining(nextReset - Date.now());
  });

  useEffect(() => {
    const updateCountdown = () => {
      const nextReset = getNextResetTime();
      setTimeRemaining(formatTimeRemaining(nextReset - Date.now()));
    };

    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return timeRemaining;
}
