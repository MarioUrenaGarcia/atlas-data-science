import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { buttonClass, type ButtonStyleProps } from './buttonClass.ts';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, iconOnly, pressed, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, iconOnly, pressed }, className)}
      aria-pressed={pressed}
      {...rest}
    >
      {children}
    </button>
  );
});
