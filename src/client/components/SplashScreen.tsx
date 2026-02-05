import { useState } from 'react';
import Logo from '../../../assets/icon.svg?react';
import { Button } from './ui/Button';
import { isProduction } from '../utils/isProduction';

type Props = {
  onPlay: () => void;
};

export function SplashScreen({ onPlay }: Props) {
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const handleDebugReset = async () => {
    setResetting(true);
    setResetResult(null);

    try {
      const res = await fetch('/api/debug-reset', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setResetResult(data.message);
      } else {
        setResetResult(data.message || 'Reset failed');
      }
    } catch (err) {
      setResetResult('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full">
      <Logo className="w-28 h-28" />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Meme Brain</h1>
        <p className="text-sm text-gray-600 max-w-xs">
          Pick the funniest wrong take. Get roasted. Share your result.
        </p>
      </div>

      <Button size="lg" onClick={onPlay}>
        Play Today's Challenge
      </Button>

      {!isProduction() && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-1">
          <Button onClick={handleDebugReset} disabled={resetting} size="sm">
            {resetting ? 'Resetting...' : '[DEV] Reset Database'}
          </Button>
          {resetResult && <span className="text-xs text-gray-500">{resetResult}</span>}
        </div>
      )}
    </div>
  );
}
