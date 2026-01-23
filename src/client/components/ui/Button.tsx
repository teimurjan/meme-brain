import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  selected?: boolean;
  shadow?: 'sm' | 'lg';
};

const baseStyles =
  'border-2 border-black font-medium active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white hover:bg-yellow-300 focus:ring-2 focus:ring-yellow-300 focus:outline-0',
  secondary: 'bg-orange-500 hover:bg-orange-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 font-semibold',
};

const shadowStyles = {
  sm: 'shadow-[2px_2px_0_0] disabled:active:shadow-[2px_2px_0_0]',
  lg: 'shadow-[4px_4px_0_0] disabled:active:shadow-[4px_4px_0_0]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  shadow = 'sm',
  selected = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        shadowStyles[shadow],
        selected && 'ring-2 ring-yellow-300 outline-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
