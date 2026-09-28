import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtlas } from '../../content/loader.ts';
import { LevelBadge } from '../ui/LevelBadge.tsx';
import styles from './ConceptPreview.module.css';

export interface PreviewAnchor {
  id: string;
  rect: DOMRect;
}

const GAP = 8;
const MARGIN = 12;

/** Floating summary of a linked concept, positioned below the link or above it when there is no room. */
export function ConceptPreview({ anchor }: { anchor: PreviewAnchor }) {
  const atlas = useAtlas();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const concept = atlas.byId.get(anchor.id);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    const below = anchor.rect.bottom + GAP;
    const top =
      below + height > window.innerHeight - MARGIN ? anchor.rect.top - GAP - height : below;
    const left = Math.min(Math.max(MARGIN, anchor.rect.left), window.innerWidth - width - MARGIN);
    setPosition({ top, left });
  }, [anchor]);

  if (!concept) return null;

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      className={styles.preview}
      style={
        position
          ? { top: position.top, left: position.left }
          : { visibility: 'hidden', top: 0, left: 0 }
      }
    >
      <div className={styles.header}>
        <span className={styles.title}>{concept.titulo}</span>
        <LevelBadge level={concept.nivel} />
      </div>
      <p className={styles.summary}>{concept.resumen}</p>
    </div>,
    document.body,
  );
}
