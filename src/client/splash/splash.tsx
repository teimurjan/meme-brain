import '../index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Logo from '../../../assets/icon.svg?react';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/ui/Layout';

export const Splash = () => {
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
    </Layout>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
