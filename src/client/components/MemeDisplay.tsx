import { useState } from 'react';
import clsx from 'clsx';
import type { MemeSource } from '../../shared/types';

type Props = {
  meme: MemeSource;
};

export function MemeDisplay({ meme }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className={clsx(
            'relative border-2 border-black overflow-hidden shadow-[4px_4px_0_0] cursor-zoom-in',
            !isLoaded && 'bg-transparent h-60 w-60'
          )}
        >
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className={clsx('max-h-60 w-auto object-contain', !isLoaded && 'invisible')}
            loading="eager"
            onLoad={() => setIsLoaded(true)}
          />
        </button>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 active:scale-90"
            onClick={() => setIsFullscreen(false)}
          >
            ×
          </button>
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="max-h-full max-w-full object-contain cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          />
        </div>
      )}
    </>
  );
}
