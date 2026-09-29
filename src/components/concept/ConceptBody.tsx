import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { splitFigures } from '../../content/figures.ts';
import type { ConceptContent, ConceptSection } from '../../content/types.ts';
import { ConceptFigure } from './ConceptFigure.tsx';
import { ConceptPreview, type PreviewAnchor } from './ConceptPreview.tsx';
import styles from './ConceptBody.module.css';
import { useFocusableOverflow } from './useFocusableOverflow.ts';

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

interface ConceptBodyProps {
  sections: ConceptSection[];
  figures: ConceptContent['figuras'];
  conceptId: string;
  conceptTitle: string;
}

export function ConceptBody({ sections, figures, conceptId, conceptTitle }: ConceptBodyProps) {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<PreviewAnchor | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const rendered = useMemo(
    () =>
      sections.map((section) => ({ ...section, segments: splitFigures(withBase(section.html)) })),
    [sections],
  );
  useFocusableOverflow(rootRef, rendered);

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
      ref={rootRef}
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
          {section.segments.map((segment, index) => {
            if (segment.type === 'html') {
              return (
                <div
                  key={index}
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: segment.html }}
                />
              );
            }
            const figure = figures[segment.index];
            if (!figure) return null;
            return (
              <ConceptFigure
                key={index}
                number={segment.index + 1}
                componente={figure.componente}
                parametros={figure.parametros}
                captionHtml={segment.captionHtml}
                conceptId={conceptId}
                conceptTitle={conceptTitle}
              />
            );
          })}
        </section>
      ))}
      {preview && <ConceptPreview anchor={preview} />}
    </div>
  );
}
