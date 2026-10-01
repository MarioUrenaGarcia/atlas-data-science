import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useResponsiveSize } from '../../core/useResponsiveSize.ts';
import type { VisualizationProps } from '../../types.ts';
import ContinuousGenesis from '../ContinuousGenesis/ContinuousGenesis.tsx';
import DistributionExplorer from '../DistributionExplorer/DistributionExplorer.tsx';
import DistributionGenesis from '../DistributionGenesis/DistributionGenesis.tsx';
import styles from './DistributionMap.module.css';
import { MapGraph } from './MapGraph.tsx';
import { KIND_LABELS, NODES, RELATIONS, type Relation } from './relations.ts';
import type { DistributionMapConfig } from './schema.ts';

/** Below this width the drawing would shrink its labels past legibility. */
const GRAPH_MIN_WIDTH = 620;

/**
 * Map of relations between distributions: special cases, limits,
 * constructions and mixtures. Choosing a relation, in the drawing or in the
 * list, opens a chart that shows both distributions together.
 */
export default function DistributionMap({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DistributionMapConfig;
  const relations = useMemo<readonly Relation[]>(
    () =>
      config.relaciones
        ? RELATIONS.filter((relation) => config.relaciones?.includes(relation.id))
        : RELATIONS,
    [config.relaciones],
  );
  const [selected, setSelected] = useState(config.relacion ?? relations[0]?.id ?? '');
  const relation = relations.find((item) => item.id === selected) ?? relations[0];
  const [ref, size] = useResponsiveSize<HTMLDivElement>();
  const selectId = useId();
  if (!relation) return null;
  const ends = [relation.from, relation.to].map((id) => NODES.find((node) => node.id === id));

  return (
    <div className={styles.map} ref={ref}>
      <div className={styles.picker}>
        <label htmlFor={selectId}>Relación</label>
        <select
          id={selectId}
          value={relation.id}
          onChange={(event) => setSelected(event.target.value)}
        >
          {relations.map((item) => (
            <option key={item.id} value={item.id}>
              {`${item.title} (${KIND_LABELS[item.kind].toLowerCase()})`}
            </option>
          ))}
        </select>
      </div>
      {size.width >= GRAPH_MIN_WIDTH && (
        <MapGraph
          relations={relations}
          selected={relation.id}
          onSelect={setSelected}
          label={`Mapa de relaciones entre distribuciones. Seleccionada: ${relation.title}.`}
        />
      )}
      <div className={styles.detail} aria-live="polite">
        <p className={styles.kind}>{KIND_LABELS[relation.kind]}</p>
        <p className={styles.title}>{relation.title}</p>
        <p className={styles.text}>{relation.text}</p>
        <p className={styles.links}>
          {ends.map(
            (node) =>
              node && (
                <Link key={node.id} to={`/concepto/${node.concept}`}>
                  {`Ficha: ${node.label}`}
                </Link>
              ),
          )}
        </p>
      </div>
      <div key={relation.id}>
        {relation.view.componente === 'DistributionExplorer' ? (
          <DistributionExplorer
            params={relation.view.parametros}
            conceptId={conceptId}
            title={`${title}: ${relation.title}`}
          />
        ) : relation.view.componente === 'ContinuousGenesis' ? (
          <ContinuousGenesis
            params={relation.view.parametros}
            conceptId={conceptId}
            title={`${title}: ${relation.title}`}
          />
        ) : (
          <DistributionGenesis
            params={relation.view.parametros}
            conceptId={conceptId}
            title={`${title}: ${relation.title}`}
          />
        )}
      </div>
    </div>
  );
}
