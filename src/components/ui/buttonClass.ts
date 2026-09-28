import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: 'normal' | 'small';
  iconOnly?: boolean;
  pressed?: boolean;
}

export function buttonClass(
  { variant = 'secondary', size = 'normal', iconOnly, pressed }: ButtonStyleProps,
  extra?: string,
) {
  return [
    styles.button,
    styles[variant],
    size === 'small' ? styles.small : '',
    iconOnly ? styles.icon : '',
    pressed ? styles.pressed : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}
