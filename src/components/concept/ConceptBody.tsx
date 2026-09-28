import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConceptSection } from '../../content/types.ts';
import { ConceptPreview, type PreviewAnchor } from './ConceptPreview.tsx';
import styles from './ConceptBody.module.css';

const BASE = import.meta.env.BASE_URL;

/** Internal links are generated with root-relative paths; this adds the deployment base. */
function withBase(html: string): string {
  if (BASE === '/') return html;
  return html.replaceAll('href="/concepto/', `href="${BASE}concepto/`);
}

function conceptLink(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLAnchorElement>('a[data-concept]');
}

const PREVIEW_DELAY_MS = 250;

export function ConceptBody({ sections }: { sections: ConceptSection[] }) {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<PreviewAnchor | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const rendered = useMemo(
    () => sections.map((section) => ({ ...section, html: withBase(section.html) })),
    [sections],
  );

  const show = (link: HTMLAnchorElement) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const id = link.dataset.concept;
      if (id) setPreview({ id, rect: link.getBoundingClientRect() });
    }, PREVIEW_DELAY_MS);
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    setPreview(null);
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = conceptLink(event.target);
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const id = link.dataset.concept;
    if (!id) return;
    event.preventDefault();
    hide();
    navigate(`/concepto/${id}`);
  };

  return (
    // Event delegation over generated HTML: the handlers only enhance native links.
    <div
      className={styles.body}
      onClick={onClick}
      onMouseOver={(event) => {
        const link = conceptLink(event.target);
        if (link) show(link);
      }}
      onMouseOut={(event) => {
        if (conceptLink(event.target)) hide();
      }}
      onFocus={(event) => {
        const link = conceptLink(event.target);
        if (link) show(link);
      }}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === 'Escape') hide();
      }}
    >
      {rendered.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={styles.section}
          aria-labelledby={`${section.id}-titulo`}
        >
          <h2 id={`${section.id}-titulo`} className={styles.heading}>
            {section.titulo}
          </h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: section.html }} />
        </section>
      ))}
      {preview && <ConceptPreview anchor={preview} />}
    </div>
  );
}
