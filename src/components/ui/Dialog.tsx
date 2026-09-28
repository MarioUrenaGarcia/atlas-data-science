import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button.tsx';
import styles from './Dialog.module.css';
import { useDialogClose } from './useDialogClose.ts';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

/**
 * Modal built on the native dialog element, which provides focus trapping,
 * Escape handling and an inert background without extra code.
 */
export function Dialog({ open, onClose, title, closeLabel, children, footer, wide }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useDialogClose(ref, onClose);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={wide ? `${styles.dialog} ${styles.wide}` : styles.dialog}
      aria-label={title}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Button variant="ghost" iconOnly size="small" aria-label={closeLabel} onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </Button>
      </div>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </dialog>
  );
}
