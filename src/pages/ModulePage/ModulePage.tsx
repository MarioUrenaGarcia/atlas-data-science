import { CornerDownRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { ConceptListItem } from '../../components/concept/ConceptListItem.tsx';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { LevelBadge } from '../../components/ui/LevelBadge.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { useAtlas } from '../../content/loader.ts';
import NotFoundPage from '../NotFoundPage/NotFoundPage.tsx';
import styles from './ModulePage.module.css';

export default function ModulePage() {
  const { numero } = useParams();
  const atlas = useAtlas();
  const module = atlas.moduleByNumber.get(Number(numero));
  if (!module) return <NotFoundPage message={strings.modules.notFound} />;
  const color = moduleColor(module.numero);
  // Submodules without published concepts are left out rather than shown empty.
  const submodules = module.submodulos.filter((submodule) => submodule.conceptos.length > 0);

  return (
    <>
      <Breadcrumbs
        label={strings.concept.breadcrumbLabel}
        color={color}
        items={[
          { label: strings.modules.title, to: '/modulos' },
          { label: strings.modules.moduleLabel(module.numero) },
        ]}
      />
      <PageHeader title={module.titulo} intro={module.descripcion} />
      {submodules.length > 1 && (
        <nav aria-label={strings.concept.contents} className={styles.toc}>
          <ol>
            {submodules.map((submodule) => (
              <li key={submodule.clave}>
                <a href={`#sub-${submodule.clave}`}>
                  <span className="mono">{submodule.clave}</span> {submodule.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {submodules.map((submodule) => (
        <section
          key={submodule.clave}
          id={`sub-${submodule.clave}`}
          className={styles.submodule}
          aria-labelledby={`titulo-${submodule.clave}`}
        >
          <div className={styles.submoduleHeader} style={{ borderLeftColor: color }}>
            <h2 id={`titulo-${submodule.clave}`} className={styles.submoduleTitle}>
              <span className={styles.key}>{submodule.clave}</span> {submodule.titulo}
            </h2>
            <div className={styles.levels}>
              {submodule.nivel.map((level) => (
                <LevelBadge key={level} level={level} />
              ))}
              <span className={styles.count}>
                {strings.modules.conceptCount(submodule.conceptos.length)}
              </span>
            </div>
            <p className={styles.description}>{submodule.descripcion}</p>
          </div>
          <ol className={styles.concepts}>
            {submodule.conceptos.map((id) => {
              const concept = atlas.byId.get(id);
              return concept ? (
                <li key={id}>
                  <ConceptListItem concept={concept} />
                </li>
              ) : null;
            })}
          </ol>
          {submodule.enlaces.length > 0 && (
            <div className={styles.links}>
              <p className={styles.linksTitle}>{strings.modules.seeAlso}</p>
              <ul>
                {submodule.enlaces.map((id) => {
                  const concept = atlas.byId.get(id);
                  if (!concept) return null;
                  return (
                    <li key={id}>
                      <CornerDownRight size={14} aria-hidden="true" />
                      <Link to={`/concepto/${id}`}>{concept.titulo}</Link>
                      <span className={styles.linkModule}>{concept.submodulo}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
