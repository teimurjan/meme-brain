import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface Props extends PropsWithChildren {
  className?: string;
}

export function Layout({ children, className }: Props) {
  return (
    <div className={clsx('flex flex-col min-h-screen p-4 bg-orange-50', className)}>{children}</div>
  );
}
