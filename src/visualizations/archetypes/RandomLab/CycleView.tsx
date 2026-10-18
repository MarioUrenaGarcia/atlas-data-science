import { useMemo, useState } from 'react';
import { hullDobell, LinearCongruential } from '../../../lib/random/generators.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import styles from './RandomLab.module.css';
import type { RandomLabConfig } from './schema.ts';

const STEPS_PER_SECOND = 2;
const NODE_RADIUS = 9;
/** Labels are drawn only while the circle has room for them. */
const LABEL_LIMIT = 32;

interface CycleViewProps {
  config: RandomLabConfig;
  title: string;
}

/**
 * A small linear congruential generator as a walk on the m states arranged
 * in a circle: each step jumps from x to (a x + c) mod m. The walk always
 * returns to a state already visited, and from there it repeats forever.
 */
export function CycleView({ config, title }: CycleViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('m', 'Módulo', 'm', 4, 64, 1, initial.m ?? 16, 0),
      num('a', 'Multiplicador', 'a', 1, 63, 1, initial.a ?? 5, 0),
      num('c', 'Incremento', 'c', 0, 63, 1, initial.c ?? 3, 0),
      num('x0', 'Semilla', 'x₀', 0, 63, 1, initial.x0 ?? 7, 0),
    ],
    [initial.m, initial.a, initial.c, initial.x0],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const m = Number(v.m);
  const a = Number(v.a) % m;
  const c = Number(v.c) % m;
  const x0 = Number(v.x0) % m;
  const [steps, setSteps] = useState(0);
  const path = useMemo(() => {
    const g = new LinearCongruential(a, c, m, x0);
    const states = [x0];
    const seen = new Map<number, number>([[x0, 0]]);
    let cycleStart = -1;
    for (let i = 1; i <= m; i += 1) {
      const x = g.nextInt();
      if (seen.has(x)) {
        cycleStart = seen.get(x) ?? 0;
        states.push(x);
        break;
      }
      seen.set(x, i);
      states.push(x);
    }
    return { states, cycleStart };
  }, [a, c, m, x0]);
  const total = path.states.length - 1;
  const shown = Math.min(steps, total);
  const period = total - path.cycleStart;
  const full = hullDobell(a, c, m);
  const playback = usePlayback({
    step: () => setSteps((value) => value + 1),
    reset: () => setSteps(0),
    rate: STEPS_PER_SECOND,
    done: steps >= total,
    autoplay: false,
  });
  const visited = path.states.slice(0, shown + 1);
  const current = visited[visited.length - 1] ?? x0;
  const description =
    `Generador x(n+1) = (${a} x(n) + ${c}) mod ${m} desde x0 = ${x0}. Periodo ${period}${period === m ? ', completo' : ''}. ` +
    `Se han dado ${shown} pasos; el estado actual es ${current}, que da u = ${formatNumber(current / m, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{
        ...parameters,
        values: v,
        reset: () => {
          parameters.reset();
          setSteps(0);
        },
      }}
      readouts={[
        { label: 'Periodo', value: `${period} de ${m}`, color: DATA_COLORS.primary },
        { label: 'Condiciones de Hull y Dobell', value: full ? 'se cumplen' : 'no se cumplen' },
        { label: 'Pasos dados', value: String(shown) },
        { label: 'Estado actual x(n)', value: String(current), color: DATA_COLORS.secondary },
        { label: 'Uniforme u = x(n)/m', value: formatNumber(current / m, 4) },
      ]}
      legend={[
        { label: 'Estados recorridos', color: DATA_COLORS.primary },
        { label: 'Estado actual', color: DATA_COLORS.secondary },
        { label: 'Estados nunca visitados', color: DATA_COLORS.light },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => {
          loadPreset(preset, definitions, parameters.set);
          setSteps(0);
        }}
      />
      <FormulaLine
        tex={`x_{n+1} = (${a}\\,x_n + ${c}) \\bmod ${m},\\qquad u_n = \\frac{x_n}{${m}},\\qquad x_0 = ${x0}`}
      />
      <p className={styles.sequence} aria-live="polite">
        {visited.join(', ')}
      </p>
      <ChartSvg label={description} aspect={0.9} maxHeight={440}>
        {(box) => {
          const cx = box.inner.left + box.inner.width / 2;
          const cy = box.inner.top + box.inner.height / 2;
          const radius = Math.min(box.inner.width, box.inner.height) / 2 - NODE_RADIUS - 4;
          const at = (state: number): [number, number] => {
            const angle = (2 * Math.PI * state) / m - Math.PI / 2;
            return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
          };
          const onPath = new Set(path.states);
          const done = new Set(visited);
          return (
            <g aria-hidden="true">
              {visited.slice(1).map((state, i) => {
                const [x1, y1] = at(visited[i] ?? 0);
                const [x2, y2] = at(state);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={DATA_COLORS.primary}
                    strokeOpacity={0.5}
                    strokeWidth={1.5}
                  />
                );
              })}
              {Array.from({ length: m }, (_, state) => {
                const [x, y] = at(state);
                const fill =
                  state === current
                    ? DATA_COLORS.secondary
                    : done.has(state)
                      ? DATA_COLORS.primary
                      : onPath.has(state)
                        ? 'var(--color-surface)'
                        : DATA_COLORS.light;
                return (
                  <g key={state}>
                    <circle
                      cx={x}
                      cy={y}
                      r={m > LABEL_LIMIT ? NODE_RADIUS / 2 : NODE_RADIUS}
                      fill={fill}
                      stroke="var(--color-border-strong)"
                    />
                    {m <= LABEL_LIMIT && (
                      <text
                        x={x}
                        y={y}
                        dy="0.35em"
                        textAnchor="middle"
                        className={styles.label}
                        style={{
                          fontSize: 9,
                          fill: done.has(state) ? 'var(--color-surface)' : undefined,
                        }}
                      >
                        {state}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
