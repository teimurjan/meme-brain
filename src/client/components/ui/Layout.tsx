import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { ClubBackground } from '../ClubBackground';
import { useGameSound, useSoundSettings } from '../../contexts/GameSoundContext';

type Props = PropsWithChildren<{
  className?: string;
  variant?: 'default' | 'secondary';
  container?: 'default' | 'fullscreen';
  onBack?: () => void;
  backText?: string;
}>;

export function Layout({
  children,
  className,
  variant = 'default',
  container = 'default',
  onBack,
  backText = '← Back',
}: Props) {
  const { isMuted, toggleMute } = useSoundSettings();
  const playLinkClick = useGameSound('link');
  const isFullScreen = container === 'fullscreen';

  return (
    <div
      className={clsx(
        'flex flex-col p-4 relative pt-0 h-full',
        className,
        variant === 'secondary' ? 'bg-zinc-900' : 'bg-orange-50'
      )}
    >
      {variant === 'secondary' && (
        <ClubBackground className="absolute inset-0 w-full h-full z-10" />
      )}

      <div className={clsx('z-20 relative pt-8 h-full', !isFullScreen && 'max-w-sm mx-auto')}>
        {!isFullScreen && backText && onBack && (
          <button
            type="button"
            onClick={() => {
              playLinkClick();
              onBack?.();
            }}
            className={clsx(
              'absolute top-1 left-0 z-30 text-sm font-medium hover:underline active:scale-95',
              variant === 'secondary' ? 'text-zinc-400' : 'text-gray-600'
            )}
          >
            {backText}
          </button>
        )}

        {!isFullScreen && (
          <button
            type="button"
            onClick={() => {
              playLinkClick();
              toggleMute();
            }}
            className={clsx(
              'absolute top-1 right-0 z-30 text-sm font-medium hover:underline active:scale-95',
              variant === 'secondary' ? 'text-zinc-400' : 'text-gray-600'
            )}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
