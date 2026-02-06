import '../index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameSoundProvider } from '../contexts/GameSoundContext';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameSoundProvider>
      <App />
    </GameSoundProvider>
  </StrictMode>
);
