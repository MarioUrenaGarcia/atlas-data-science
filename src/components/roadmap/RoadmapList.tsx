import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import type { AtlasData } from '../../content/loader.ts';
import { MINUTES_BY_LEVEL } from '../../lib/format/time.ts';
import { useProgress } from '../../store/progress.ts';
import { LevelBadge } from '../ui/LevelBadge.tsx';
import { moduleColor } from '../ui/moduleColor.ts';
import styles from './RoadmapList.module.css';

interface RoadmapListProps {
  atlas: AtlasData;
  concepts: string[];
  target?: string;
}

interface Block {
  submodulo: string;
  ids: string[];
}

/** Numbered study plan; consecutive concepts of the same submodule are grouped. */
export function RoadmapList({ atlas, concepts, target }: RoadmapListProps) {
  const statuses = useProgress((state) => state.conceptos);
  const toggle = useProgress((state) => state.toggleStatus);

  const blocks: Block[] = [];
  for (const id of concepts) {
    const node = atlas.byId.get(id);
    if (!node) continue;
    const last = blocks[blocks.length - 1];
    if (last && last.submodulo === node.submodulo) last.ids.push(id);
    else blocks.push({ submodulo: node.submodulo, ids: [id] });
  }

  let step = 0;
  return (
    <div className={styles.list}>
      {blocks.map((block, blockIndex) => {
        const submodule = atlas.submoduleByKey.get(block.submodulo);
        const moduleNumber = Number(block.submodulo.split('.')[0]);
        return (
          <section
            key={`${block.submodulo}-${blockIndex}`}
            className={styles.block}
            style={{ borderLeftColor: moduleColor(moduleNumber) }}
            aria-label={`${block.submodulo} ${submodule?.titulo ?? ''}`}
          >
            <p className={styles.blockTitle}>
              <span className="mono">{block.submodulo}</span> {submodule?.titulo}
            </p>
            <ol className={styles.steps}>
              {block.ids.map((id) => {
                step += 1;
                const node = atlas.byId.get(id);
                if (!node) return null;
                const mastered = statuses[id] === 'dominado';
                return (
                  <li
                    key={id}
                    className={id === target ? `${styles.step} ${styles.target}` : styles.step}
                    value={step}
                  >
                    <span className={styles.number} aria-hidden="true">
                      {step}
                    </span>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={mastered}
                      onChange={() => toggle(id, 'dominado')}
                      aria-label={`${strings.progress.markMastered}: ${node.titulo}`}
                    />
                    <div className={styles.body}>
                      <Link
                        to={`/concepto/${id}`}
                        className={mastered ? styles.doneLink : undefined}
                      >
                        {node.titulo}
                      </Link>
                      {id === target && (
                        <span className={styles.targetLabel}>{strings.roadmap.target}</span>
                      )}
                    </div>
                    <LevelBadge level={node.nivel} />
                    <span className={styles.minutes}>
                      {strings.time.minutes(MINUTES_BY_LEVEL[node.nivel])}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
