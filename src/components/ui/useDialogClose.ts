import { useEffect, useRef, type RefObject } from 'react';

/**
 * Listens to the native "close" event of a dialog element. The event does not
 * bubble, so it is attached directly instead of relying on React's synthetic
 * handler; this also covers closing with the Escape key.
 */
export function useDialogClose(ref: RefObject<HTMLDialogElement>, onClose: () => void): void {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handle = () => latest.current();
    dialog.addEventListener('close', handle);
    return () => dialog.removeEventListener('close', handle);
  }, [ref]);
}
