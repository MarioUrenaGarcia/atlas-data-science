import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClass, type ButtonStyleProps } from './buttonClass.ts';

interface ButtonLinkProps extends LinkProps, ButtonStyleProps {
  children: ReactNode;
}

export function ButtonLink({
  variant,
  size,
  iconOnly,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, iconOnly }, className)} {...rest}>
      {children}
    </Link>
  );
}
