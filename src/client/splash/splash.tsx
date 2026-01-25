import '../index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Logo from '../../../assets/icon.svg?react';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/ui/Layout';
import { isProduction } from '../utils/isProduction';

export const Splash = () => {
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const handleDebugReset = async () => {
    setResetting(true);
    setResetResult(null);

    try {
      const res = await fetch('/api/debug-reset', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setResetResult(`Deleted ${data.deletedKeys.length} keys`);
      } else {
        setResetResult('Reset failed');
      }
    } catch (err) {
      setResetResult('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setResetting(false);
    }
  };

  return (
    <Layout className="relative justify-center items-center gap-6">
      <Logo className="w-28 h-28" />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Meme Brain</h1>
        <p className="text-sm text-gray-600 max-w-xs">
          Pick how you'd misread the meme. Get roasted. Share your result.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button size="lg" shadow="lg" onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}>
          Play Today's Challenge
        </Button>
      </div>

      {!isProduction() && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-1">
          <Button
            onClick={handleDebugReset}
            disabled={resetting}
            variant="primary"
            size="sm"
            shadow="sm"
          >
            {resetting ? 'Resetting...' : '[DEV] Reset Database'}
          </Button>
          {resetResult && <span className="text-xs text-gray-500">{resetResult}</span>}
        </div>
      )}
    </Layout>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
