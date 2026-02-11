import { useState } from 'react';
import clsx from 'clsx';
import type { MemeSource } from '../../shared/types';
import { isMobile } from '../utils/isMobile';

type Props = {
  meme: MemeSource;
  className?: string;
};

export function MemeDisplay({ meme, className }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className={clsx('flex flex-col items-center', className)}>
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className={clsx(
            'relative border-2 border-black overflow-hidden shadow-[4px_4px_0_0] cursor-zoom-in',
            !isLoaded && 'bg-transparent h-60 w-60',
            isMobile() && 'h-40 w-40'
          )}
        >
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className={clsx(
              'w-full object-contain',
              !isLoaded && 'invisible',
              isMobile() ? 'max-h-40' : 'max-h-60'
            )}
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
