import { scaleLinear } from 'd3-scale';
import { useCallback, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  emptyReservoir,
  reservoirSample,
  reservoirStep,
  type ReservoirState,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SamplingProcess.module.css';
import type { ReservoirConfig } from './schema.ts';

const ITEMS_PER_SECOND = 1.5;
const BATCH = 25;

interface State {
  stream: ReservoirState;
  /** Times each item ended in the reservoir over the replayed streams. */
  counts: number[];
  replays: number;
}

/** Algorithm R on a stream of items, then many replays to show equal inclusion frequencies. */
export function ReservoirView({
  config,
  title,
  conceptId,
}: {
  config: ReservoirConfig;
  title: string;
  conceptId: string;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'k',
      label: 'Tamaño del reservorio',
      symbol: 'k',
      min: 1,
      max: 12,
      step: 1,
      default: config.k,
    },
    {
      type: 'number',
      key: 'N',
      label: 'Longitud del flujo',
      symbol: 'N',
      min: 5,
      max: 60,
      step: 1,
      default: config.longitud,
    },
  ];
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const N = Number(parameters.values.N);
  const replaysTarget = config.repeticiones ?? 2000;
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${k}|${N}|${seed.seed}|${run}`;
  const [state, update] = useResettableState<State>(key, () => ({
    stream: emptyReservoir(),
    counts: new Array<number>(N).fill(0),
    replays: 0,
  }));
  const step = useCallback(
    (count: number) =>
      update((previous) => {
        let next = previous;
        for (let i = 0; i < count; i += 1) {
          if (next.stream.seen < N) {
            const random = new Random((seed.seed * 31 + next.stream.seen * 7919 + run) >>> 0);
            next = { ...next, stream: reservoirStep(next.stream, k, random) };
          } else if (next.replays < replaysTarget) {
            const counts = [...next.counts];
            const random = new Random((seed.seed * 131 + next.replays * 104729 + run) >>> 0);
            const batch = Math.min(BATCH, replaysTarget - next.replays);
            for (let r = 0; r < batch; r += 1)
              for (const item of reservoirSample(N, k, random))
                counts[item] = (counts[item] ?? 0) + 1;
            next = { ...next, counts, replays: next.replays + batch };
          } else break;
        }
        return next;
      }),
    [update, N, k, seed.seed, run, replaysTarget],
  );
  const streaming = state.stream.seen < N;
  const playback = usePlayback({
    step: () => step(1),
    stepMany: step,
    reset: () => setRun((v) => v + 1),
    rate: streaming ? ITEMS_PER_SECOND : 4,
    done: !streaming && state.replays >= replaysTarget,
  });
  const last = state.stream.last;
  const t = state.stream.seen;
  const name = config.nombreElemento.toLowerCase();
  const header = !last
    ? `P(\\text{${name} } i \\text{ en el reservorio tras } t) = \\frac{k}{t}`
    : last.action === 'llenar'
      ? `t = ${t} \\le k = ${k}:\\ \\text{entra directamente en la casilla } ${last.slot + 1}`
      : `t = ${t}:\\ j \\sim \\text{Unif}\\{1, \\dots, ${t}\\},\\ j = ${last.draw + 1} ${last.action === 'reemplazar' ? `\\le ${k} \\Rightarrow \\text{reemplaza la casilla } ${last.slot + 1}` : `> ${k} \\Rightarrow \\text{se descarta}`},\\quad \\frac{k}{t} = ${formatNumber(k / t, 3)}`;
  const description =
    `Flujo de ${N} ${name}s y reservorio de ${k}. Vistos ${t}; en el reservorio: ${state.stream.reservoir.map((i) => i + 1).join(', ')}. ` +
    (state.replays > 0
      ? `Tras ${state.replays} flujos repetidos, cada ${name} quedó en la muestra cerca de ${formatNumber((k / N) * 100, 1)} % de las veces.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: `${config.nombreElemento}s vistos`, value: `${t} de ${N}` },
        {
          label: 'Probabilidad de conservar el último',
          value: t === 0 ? 'sin datos' : formatNumber(Math.min(1, k / t), 3),
          color: DATA_COLORS.highlight,
        },
        { label: 'Flujos repetidos', value: String(state.replays) },
        {
          label: 'Frecuencia teórica k/N',
          value: formatNumber(k / N, 3),
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: `${config.nombreElemento} en el reservorio`, color: DATA_COLORS.highlight },
        { label: 'Último en llegar', color: DATA_COLORS.negative, shape: 'line' },
        { label: 'Frecuencia teórica k/N', color: DATA_COLORS.primary, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {streaming
          ? last?.action === 'descartar'
            ? `El ${name} ${t} se descarta y el reservorio no cambia`
            : `El ${name} ${t} entra al reservorio`
          : 'El flujo terminó: se repite muchas veces para contar cuántas veces queda cada uno'}
      </p>
      <ChartSvg
        label={description}
        aspect={0.32}
        minHeight={170}
        maxHeight={240}
        margins={{ top: 18, bottom: 10, left: 8, right: 8 }}
      >
        {(box) => {
          const cw = box.inner.width / N;
          const inReservoir = new Set(state.stream.reservoir);
          const slotW = Math.min(52, box.inner.width / k - 6);
          const slotsLeft = box.inner.left + (box.inner.width - k * (slotW + 6)) / 2;
          const slotY = box.inner.top + box.inner.height - 46;
          return (
            <g>
              <text x={box.inner.left} y={box.inner.top - 4} className={styles.labelMuted}>
                Flujo
              </text>
              {Array.from({ length: N }, (_, i) => {
                const seen = i < t;
                const isLast = last?.item === i;
                return (
                  <g key={i}>
                    <rect
                      x={box.inner.left + i * cw + 1}
                      y={box.inner.top + 4}
                      width={Math.max(1, cw - 2)}
                      height={26}
                      rx={3}
                      fill={
                        inReservoir.has(i)
                          ? DATA_COLORS.highlight
                          : seen
                            ? DATA_COLORS.neutral
                            : DATA_COLORS.primary
                      }
                      fillOpacity={inReservoir.has(i) ? 0.95 : seen ? 0.25 : 0.12}
                      stroke={isLast ? DATA_COLORS.negative : 'none'}
                      strokeWidth={2.5}
                    />
                    {cw > 14 && (
                      <text
                        x={box.inner.left + (i + 0.5) * cw}
                        y={box.inner.top + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={styles.small}
                      >
                        {i + 1}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={slotsLeft} y={slotY - 8} className={styles.labelMuted}>
                Reservorio
              </text>
              {Array.from({ length: k }, (_, s) => {
                const item = state.stream.reservoir[s];
                const changed = last && last.action !== 'descartar' && last.slot === s;
                return (
                  <g key={s}>
                    <rect
                      x={slotsLeft + s * (slotW + 6)}
                      y={slotY}
                      width={slotW}
                      height={36}
                      rx={5}
                      fill={item === undefined ? 'none' : DATA_COLORS.highlight}
                      fillOpacity={0.85}
                      stroke={changed ? DATA_COLORS.negative : DATA_COLORS.text}
                      strokeWidth={changed ? 2.5 : 1}
                    />
                    <text
                      x={slotsLeft + s * (slotW + 6) + slotW / 2}
                      y={slotY + 18}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={styles.label}
                    >
                      {item === undefined ? '' : item + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      {state.replays > 0 && (
        <ChartSvg
          label="Frecuencia con que cada elemento termina en el reservorio"
          aspect={0.3}
          minHeight={160}
          maxHeight={220}
          margins={{ left: 48, bottom: 36, top: 12 }}
        >
          {(box) => {
            const freq = state.counts.map((c) => c / state.replays);
            const y = scaleLinear()
              .domain([0, Math.min(1, Math.max(...freq, k / N) * 1.4)])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const cw = box.inner.width / N;
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={4}
                  format={(v) => `${Math.round(v * 100)} %`}
                />
                {freq.map((f, i) => (
                  <rect
                    key={i}
                    x={box.inner.left + i * cw + 1}
                    y={y(f)}
                    width={Math.max(1, cw - 2)}
                    height={y(0) - y(f)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.75}
                  />
                ))}
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(k / N)}
                  y2={y(k / N)}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                <text
                  x={box.inner.left + box.inner.width / 2}
                  y={box.inner.top + box.inner.height + 24}
                  textAnchor="middle"
                  className={styles.labelMuted}
                >
                  {`Posición en el flujo (1 a ${N})`}
                </text>
              </g>
            );
          }}
        </ChartSvg>
      )}
    </VizFrame>
  );
}
