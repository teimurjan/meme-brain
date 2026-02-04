import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { ClubBackground } from '../ClubBackground';

interface Props extends PropsWithChildren {
  className?: string;
  variant?: 'default' | 'secondary';
  container?: 'default' | 'fullscreen';
}

export function Layout({ children, className, variant = 'default', container = 'default' }: Props) {
  return (
    <div
      className={clsx(
        'flex flex-col min-h-screen p-4 relative',
        className,
        variant === 'secondary' ? 'bg-zinc-900' : 'bg-orange-50'
      )}
    >
      {variant === 'secondary' && (
        <ClubBackground className="absolute inset-0 w-full h-full z-10" />
      )}

      <div className={clsx('z-20', container === 'default' && 'max-w-sm mx-auto')}>{children}</div>
    </div>
  );
}
