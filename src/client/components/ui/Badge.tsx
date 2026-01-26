import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'error';

type Props = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  info: 'bg-blue-100',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
};

export function Badge({ variant = 'info', children, className }: Props) {
  return (
    <span
      className={clsx(
        'border-2 border-black px-3 py-1.5 text-sm/none font-semibold shadow-[2px_2px_0_0]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
