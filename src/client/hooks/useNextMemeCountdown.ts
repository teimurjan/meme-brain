import { useEffect, useState } from 'react';
import { getNextResetTime, formatTimeUntilReset } from '../../shared/utils/date';

export function useNextMemeCountdown(): string {
  const [timeRemaining, setTimeRemaining] = useState(() => formatTimeUntilReset());

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(formatTimeUntilReset());
    };

    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return timeRemaining;
}

export { getNextResetTime };
