import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { ClubBackground } from '../ClubBackground';

type Props = PropsWithChildren<{
  className?: string;
  variant?: 'default' | 'secondary';
  container?: 'default' | 'fullscreen';
  backButton?: {
    onClick?: () => void;
    label?: string;
  };
  nextButton?: {
    onClick?: () => void;
    label?: string;
  };
}>;

export function Layout({
  children,
  className,
  variant = 'default',
  container = 'default',
  backButton,
  nextButton,
}: Props) {
  const navigationButton = backButton ?? nextButton;
  const defaultButtonLabel = backButton ? '← Back' : 'Next →';

  return (
    <div
      className={clsx(
        'flex flex-col min-h-screen p-4 relative',
        className,
        variant === 'secondary' ? 'bg-zinc-900' : 'bg-orange-50',
        navigationButton && 'pt-0'
      )}
    >
      {variant === 'secondary' && (
        <ClubBackground className="absolute inset-0 w-full h-full z-10" />
      )}

      <div
        className={clsx(
          'z-20 relative',
          container === 'default' && 'max-w-sm mx-auto',
          navigationButton && 'pt-8'
        )}
      >
        {navigationButton && (
          <button
            type="button"
            onClick={navigationButton.onClick}
            className={clsx(
              'absolute top-1 z-30 text-sm font-medium hover:underline active:scale-95',
              variant === 'secondary' ? 'text-zinc-200' : 'text-gray-700',
              backButton && 'left-0',
              nextButton && 'right-0'
            )}
          >
            {navigationButton.label ?? defaultButtonLabel}
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
