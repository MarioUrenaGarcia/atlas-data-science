import { Circle, Layers, Waypoints, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { KnowledgeMap, type MapView } from '../../components/graph/KnowledgeMap.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { ButtonLink } from '../../components/ui/ButtonLink.tsx';
import { LevelBadge } from '../../components/ui/LevelBadge.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { SegmentedControl } from '../../components/ui/SegmentedControl.tsx';
import { LEVEL_ORDER } from '../../content/levels.ts';
import { useAtlas, useMapLayout } from '../../content/loader.ts';
import type { ConceptNode, Level } from '../../content/types.ts';
import { useProgress } from '../../store/progress.ts';
import styles from './MapPage.module.css';

type StatusFilter = 'todos' | 'pendientes' | 'vistos' | 'dominados';

const VIEW_OPTIONS = [
  {
    value: 'conceptos',
    label: strings.map.conceptsView,
    icon: <Circle size={16} aria-hidden="true" />,
  },
  {
    value: 'modulos',
    label: strings.map.modulesView,
    icon: <Layers size={16} aria-hidden="true" />,
  },
] as const;

export default function MapPage() {
  const atlas = useAtlas();
  const layout = useMapLayout();
  const statuses = useProgress((state) => state.conceptos);
  const [view, setView] = useState<MapView>('conceptos');
  const [selected, setSelected] = useState<string | null>(null);
  const [focusModule, setFocusModule] = useState<number | null>(null);
  const [modules, setModules] = useState<Set<number>>(new Set());
  const [level, setLevel] = useState<Level | ''>('');
  const [status, setStatus] = useState<StatusFilter>('todos');
  useDocumentTitle(strings.map.title);

  const isVisible = useCallback(
    (node: ConceptNode) => {
      if (modules.size > 0 && !modules.has(node.modulo)) return false;
      if (level && node.nivel !== level) return false;
      const current = statuses[node.id];
      if (status === 'pendientes' && current === 'dominado') return false;
      if (status === 'vistos' && current !== 'visto') return false;
      if (status === 'dominados' && current !== 'dominado') return false;
      return true;
    },
    [modules, level, status, statuses],
  );

  const visibleNodes = useMemo(() => atlas.nodes.filter(isVisible), [atlas.nodes, isVisible]);
  const selectedNode = selected ? atlas.byId.get(selected) : undefined;

  const toggleModule = (numero: number) => {
    setModules((current) => {
      const next = new Set(current);
      if (next.has(numero)) next.delete(numero);
      else next.add(numero);
      return next;
    });
  };

  return (
    <>
      <PageHeader title={strings.map.title} intro={strings.map.intro} />

      <div className={styles.toolbar}>
        <SegmentedControl
          label={strings.map.title}
          value={view}
          options={VIEW_OPTIONS}
          onChange={setView}
        />
        <label className={styles.select}>
          <span>{strings.map.level}</span>
          <select value={level} onChange={(event) => setLevel(event.target.value as Level | '')}>
            <option value="">{strings.search.allLevels}</option>
            {LEVEL_ORDER.map((option) => (
              <option key={option} value={option}>
                {strings.levels[option]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.select}>
          <span>{strings.map.status}</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            <option value="todos">{strings.map.statusAll}</option>
            <option value="pendientes">{strings.map.statusPending}</option>
            <option value="vistos">{strings.map.statusSeen}</option>
            <option value="dominados">{strings.map.statusMastered}</option>
          </select>
        </label>
      </div>

      <fieldset className={styles.modules}>
        <legend className={styles.legend}>{strings.map.modules}</legend>
        <button
          type="button"
          className={modules.size === 0 ? `${styles.chip} ${styles.chipActive}` : styles.chip}
          aria-pressed={modules.size === 0}
          onClick={() => setModules(new Set())}
        >
          {strings.map.allModules}
        </button>
        {atlas.modules.map((module) => (
          <button
            key={module.numero}
            type="button"
            className={
              modules.has(module.numero) ? `${styles.chip} ${styles.chipActive}` : styles.chip
            }
            aria-pressed={modules.has(module.numero)}
            title={module.titulo}
            onClick={() => toggleModule(module.numero)}
          >
            <span
              className={styles.swatch}
              style={{ background: moduleColor(module.numero) }}
              aria-hidden="true"
            />
            {module.numero}
            <span className="visually-hidden">{module.titulo}</span>
          </button>
        ))}
      </fieldset>

      <p className={styles.hint}>{strings.map.hint}</p>

      <div className={styles.stage}>
        <KnowledgeMap
          atlas={atlas}
          layout={layout}
          statuses={statuses}
          isVisible={isVisible}
          view={view}
          selected={selected}
          focusModule={focusModule}
          onSelect={setSelected}
          onModuleSelect={(numero) => {
            setView('conceptos');
            setModules(new Set([numero]));
            setFocusModule(numero);
          }}
        />
        {selectedNode && (
          <aside className={styles.panel} aria-label={selectedNode.titulo}>
            <div className={styles.panelHeader}>
              <p className={styles.panelModule} style={{ color: moduleColor(selectedNode.modulo) }}>
                {atlas.moduleByNumber.get(selectedNode.modulo)?.titulo}
              </p>
              <Button
                variant="ghost"
                size="small"
                iconOnly
                aria-label={strings.map.close}
                onClick={() => setSelected(null)}
              >
                <X size={16} aria-hidden="true" />
              </Button>
            </div>
            <h2 className={styles.panelTitle}>{selectedNode.titulo}</h2>
            <LevelBadge level={selectedNode.nivel} />
            <p className={styles.panelSummary}>{selectedNode.resumen}</p>
            <p className={styles.panelMeta}>{strings.map.dependents(selectedNode.descendientes)}</p>
            <div className={styles.panelActions}>
              <ButtonLink to={`/concepto/${selectedNode.id}`} variant="primary" size="small">
                {strings.map.openConcept}
              </ButtonLink>
              <ButtonLink to={`/roadmap/${selectedNode.id}`} size="small">
                <Waypoints size={14} aria-hidden="true" />
                {strings.map.openRoadmap}
              </ButtonLink>
            </div>
          </aside>
        )}
      </div>

      {visibleNodes.length === 0 && <p className={styles.empty}>{strings.map.empty}</p>}

      <details className={styles.alternative}>
        <summary>{strings.map.textAlternative}</summary>
        {atlas.modules.map((module) => {
          const nodes = visibleNodes.filter((node) => node.modulo === module.numero);
          if (nodes.length === 0) return null;
          return (
            <section key={module.numero} aria-label={module.titulo}>
              <h3 className={styles.alternativeTitle}>{module.titulo}</h3>
              <ul className={styles.alternativeList}>
                {nodes.map((node) => (
                  <li key={node.id}>
                    <Link to={`/concepto/${node.id}`}>{node.titulo}</Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </details>
    </>
  );
}
