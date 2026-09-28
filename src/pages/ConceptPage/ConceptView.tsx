import { ArrowLeft, ArrowRight, Clock, Waypoints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { ConceptBody } from '../../components/concept/ConceptBody.tsx';
import { ConceptLinkList } from '../../components/concept/ConceptLinkList.tsx';
import { ProgressControls } from '../../components/concept/ProgressControls.tsx';
import { TableOfContents } from '../../components/concept/TableOfContents.tsx';
import { VisualizationSlot } from '../../components/concept/VisualizationSlot.tsx';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { ButtonLink } from '../../components/ui/ButtonLink.tsx';
import { LevelBadge } from '../../components/ui/LevelBadge.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { Tag } from '../../components/ui/Tag.tsx';
import { BIBLIOGRAPHY } from '../../content/bibliography.ts';
import { useAtlas, useModuleContent } from '../../content/loader.ts';
import type { ConceptNode } from '../../content/types.ts';
import { MINUTES_BY_LEVEL } from '../../lib/format/time.ts';
import styles from './ConceptPage.module.css';

export function ConceptView({ concept }: { concept: ConceptNode }) {
  const atlas = useAtlas();
  const contents = useModuleContent(concept.modulo);
  const content = contents[concept.id];
  const module = atlas.moduleByNumber.get(concept.modulo);
  const submodule = atlas.submoduleByKey.get(concept.submodulo);
  const color = moduleColor(concept.modulo);
  useDocumentTitle(concept.titulo);

  const resolve = (ids: string[]) =>
    ids.map((id) => atlas.byId.get(id)).filter((node): node is ConceptNode => node !== undefined);
  const prerequisites = resolve(concept.prerrequisitos);
  const nextSteps = resolve(concept.dependientes).sort((a, b) => atlas.compare(a.id, b.id));
  const related = concept.relaciones.flatMap((relation) => {
    const node = atlas.byId.get(relation.id);
    return node
      ? [{ concept: node, note: strings.concept.relationTypes[relation.tipo] as string }]
      : [];
  });

  const siblings = submodule?.conceptos ?? [];
  const index = siblings.indexOf(concept.id);
  const previous = index > 0 ? atlas.byId.get(siblings[index - 1] ?? '') : undefined;
  const next =
    index >= 0 && index < siblings.length - 1
      ? atlas.byId.get(siblings[index + 1] ?? '')
      : undefined;

  return (
    <article className={styles.page} style={{ ['--module-color' as string]: color }}>
      <header className={styles.header}>
        <Breadcrumbs
          label={strings.concept.breadcrumbLabel}
          color={color}
          items={[
            {
              label: module?.titulo ?? strings.modules.moduleLabel(concept.modulo),
              to: `/modulo/${concept.modulo}`,
            },
            {
              label: `${concept.submodulo} ${submodule?.titulo ?? ''}`.trim(),
              to: `/modulo/${concept.modulo}#sub-${concept.submodulo}`,
            },
          ]}
        />
        <h1 className={styles.title}>{concept.titulo}</h1>
        <p className={styles.english} lang="en">
          {concept.titulo_en}
        </p>
        {concept.borrador && <p className={styles.draft}>{strings.concept.draft}</p>}
        <div className={styles.meta}>
          <LevelBadge level={concept.nivel} />
          <span className={styles.time}>
            <Clock size={14} aria-hidden="true" />
            {strings.concept.estimatedTime(MINUTES_BY_LEVEL[concept.nivel])}
          </span>
          <ProgressControls conceptId={concept.id} />
        </div>
        <ul className={styles.tags} aria-label={strings.concept.tags}>
          {concept.etiquetas.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </header>

      <p className={styles.summary}>{concept.resumen}</p>

      {content?.formulaHtml && (
        <div
          className={styles.formula}
          role="figure"
          aria-label={strings.concept.formula}
          tabIndex={0}
          dangerouslySetInnerHTML={{ __html: content.formulaHtml }}
        />
      )}

      {content && (
        <section className={styles.visualization} aria-label={strings.concept.visualization}>
          <VisualizationSlot
            component={content.visualizacion.componente}
            params={content.visualizacion.parametros}
            conceptId={concept.id}
            title={concept.titulo}
          />
        </section>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {content && (
            <TableOfContents
              label={strings.concept.contents}
              items={content.sections.map((section) => ({
                id: section.id,
                titulo: section.titulo,
              }))}
            />
          )}
        </aside>

        <div className={styles.main}>
          {content && <ConceptBody sections={content.sections} />}

          <div className={styles.panels}>
            <section className={styles.panel} aria-labelledby="panel-prerrequisitos">
              <h2 id="panel-prerrequisitos" className={styles.panelTitle}>
                {strings.concept.prerequisites}
              </h2>
              {prerequisites.length > 0 ? (
                <ConceptLinkList concepts={prerequisites.map((node) => ({ concept: node }))} />
              ) : (
                <p className={styles.panelEmpty}>{strings.concept.noPrerequisites}</p>
              )}
              <ButtonLink to={`/roadmap/${concept.id}`} size="small" className={styles.panelAction}>
                <Waypoints size={16} aria-hidden="true" />
                {strings.concept.viewRoadmap}
              </ButtonLink>
            </section>

            <section className={styles.panel} aria-labelledby="panel-siguientes">
              <h2 id="panel-siguientes" className={styles.panelTitle}>
                {strings.concept.nextSteps}
              </h2>
              {nextSteps.length > 0 ? (
                <ConceptLinkList concepts={nextSteps.map((node) => ({ concept: node }))} />
              ) : (
                <p className={styles.panelEmpty}>{strings.concept.noNextSteps}</p>
              )}
            </section>

            {related.length > 0 && (
              <section className={styles.panel} aria-labelledby="panel-relacionados">
                <h2 id="panel-relacionados" className={styles.panelTitle}>
                  {strings.concept.related}
                </h2>
                <ConceptLinkList concepts={related} />
              </section>
            )}

            {content && content.referencias.length > 0 && (
              <section className={styles.panel} aria-labelledby="panel-referencias">
                <h2 id="panel-referencias" className={styles.panelTitle}>
                  {strings.concept.references}
                </h2>
                <ul className={styles.references}>
                  {content.referencias.map((reference) => {
                    const entry = BIBLIOGRAPHY[reference.clave];
                    return (
                      <li key={`${reference.clave}-${reference.capitulo ?? ''}`}>
                        {entry.autores}, <cite>{entry.titulo}</cite>
                        {reference.capitulo
                          ? `, ${strings.concept.chapter(reference.capitulo)}`
                          : ''}
                        .
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          <nav className={styles.pager} aria-label={submodule?.titulo ?? strings.concept.contents}>
            {previous ? (
              <Link to={`/concepto/${previous.id}`} className={styles.pagerLink} rel="prev">
                <ArrowLeft size={16} aria-hidden="true" />
                <span>
                  <span className={styles.pagerLabel}>{strings.concept.previous}</span>
                  {previous.titulo}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/concepto/${next.id}`}
                className={`${styles.pagerLink} ${styles.pagerNext}`}
                rel="next"
              >
                <span>
                  <span className={styles.pagerLabel}>{strings.concept.next}</span>
                  {next.titulo}
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
