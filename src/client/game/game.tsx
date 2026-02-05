import '../index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClickSoundProvider } from '../contexts/ClickSoundContext';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClickSoundProvider>
      <App />
    </ClickSoundProvider>
  </StrictMode>
);
