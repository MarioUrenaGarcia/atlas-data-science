import { Circle, CircleCheck, Eye } from 'lucide-react';
import { strings } from '../../app/strings.ts';
import type { ConceptStatus } from '../../store/progress.ts';

const SIZE = 16;

/** Compact progress indicator for lists; the label is exposed to assistive technology. */
export function StatusIcon({ status }: { status: ConceptStatus | undefined }) {
  if (status === 'dominado') {
    return (
      <CircleCheck
        size={SIZE}
        color="var(--color-success)"
        aria-label={strings.progress.mastered}
        role="img"
      />
    );
  }
  if (status === 'visto') {
    return (
      <Eye size={SIZE} color="var(--color-accent)" aria-label={strings.progress.seen} role="img" />
    );
  }
  return (
    <Circle
      size={SIZE}
      color="var(--color-border-strong)"
      aria-label={strings.progress.none}
      role="img"
    />
  );
}
