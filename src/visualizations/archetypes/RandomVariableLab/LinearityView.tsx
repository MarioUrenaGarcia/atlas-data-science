import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { experiment, type ExperimentId } from '../../../lib/probability/sampleSpace.ts';
import {
  expectationOf,
  findVariable,
  pmfOfVariable,
} from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import type { VariableSource } from './source.ts';

const DRAWS_PER_SECOND = 20;
const MAX_DRAWS = 1500;
const DENSE = 100;
const THIN = 5;

interface Simulation {
  n: number;
  sumX: number;
  sumY: number;
  history: { n: number; x: number; y: number; s: number }[];
  last: { x: number; y: number } | null;
}

interface LinearityViewProps {
  title: string;
  conceptId: string;
  config: RandomVariableLabConfig;
}

function sourceOf(pmf: VariableSource['pmf'], label: string, symbol: string): VariableSource {
  const lo = pmf.values[0] ?? 0;
  const hi = pmf.values.at(-1) ?? 0;
  return { pmf, label, symbol, continuous: false, cell: 1, domain: [lo - 0.5, hi + 0.5] };
}

/**
 * Linearity of expectation with two variables on the same experiment, which
 * may be dependent. The three distributions show X, Y and X + Y with their
 * means, and the simulation tracks the running averages: the average of the
 * sums is always the sum of the averages, and their limits add up exactly.
 */
export function LinearityView({ title, conceptId, config }: LinearityViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dos-dados';
  const space = experiment(experimentId);
  const vx = findVariable(experimentId, config.variable ?? 'primero');
  const vy = findVariable(experimentId, config.segunda ?? 'segundo');
  const mapX = vx?.map ?? (() => 0);
  const mapY = vy?.map ?? (() => 0);
  const px = pmfOfVariable(experimentId, mapX);
  const py = pmfOfVariable(experimentId, mapY);
  const ps = pmfOfVariable(experimentId, (o) => mapX(o) + mapY(o));
  const ex = expectationOf(px);
  const ey = expectationOf(py);
  const es = expectationOf(ps);
  // Two variables with the same symbol (two indicators, say) get subscripts so formulas,
  // legends and readouts can tell them apart.
  const sameSymbol = vx?.symbol === vy?.symbol;
  const sx = sameSymbol ? `${vx?.symbol ?? 'X'}_1` : (vx?.symbol ?? 'X');
  const sy = sameSymbol ? `${vy?.symbol ?? 'Y'}_2` : (vy?.symbol ?? 'Y');

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, `${run}`);
  const [sim, update] = useResettableState<Simulation>(`${run}|${seed.seed}`, () => ({
    n: 0,
    sumX: 0,
    sumY: 0,
    history: [],
    last: null,
  }));
  const draw = (count: number) => {
    const generator = random();
    const outcomes = Array.from(
      { length: Math.min(count, MAX_DRAWS - sim.n) },
      () => space.outcomes[generator.int(0, space.outcomes.length - 1)] ?? [],
    );
    update((previous) => {
      let { n, sumX, sumY, last } = previous;
      const history = [...previous.history];
      for (const outcome of outcomes) {
        const x = mapX(outcome);
        const y = mapY(outcome);
        n += 1;
        sumX += x;
        sumY += y;
        last = { x, y };
        if (n <= DENSE || n % THIN === 0)
          history.push({ n, x: sumX / n, y: sumY / n, s: (sumX + sumY) / n });
      }
      return { n, sumX, sumY, history, last };
    });
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: DRAWS_PER_SECOND,
    done: sim.n >= MAX_DRAWS,
  });

  const mx = sim.n > 0 ? sim.sumX / sim.n : 0;
  const my = sim.n > 0 ? sim.sumY / sim.n : 0;
  const header =
    sim.n === 0
      ? `\\mathbb{E}[${sx} + ${sy}] = \\mathbb{E}[${sx}] + \\mathbb{E}[${sy}] = ${formatNumber(ex, 3)} + ${formatNumber(ey, 3)} = ${formatNumber(es, 3)}`
      : `\\overline{${sx} + ${sy}} = \\bar{${sx}} + \\bar{${sy}} = ${formatNumber(mx, 3)} + ${formatNumber(my, 3)} = ${formatNumber(mx + my, 3)} \\qquad (n = ${sim.n})`;
  const description =
    `${space.label}. ${sx}: ${vx?.label ?? ''}, media ${formatNumber(ex, 3)}. ${sy}: ${vy?.label ?? ''}, media ${formatNumber(ey, 3)}. ` +
    `Media de la suma ${formatNumber(es, 3)}. Tras ${sim.n} repeticiones, promedios ${formatNumber(mx, 3)} y ${formatNumber(my, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        {
          label: `E[${sx.replace(/[_^{}]/g, '')}]`,
          value: formatNumber(ex, 3),
          color: DATA_COLORS.primary,
        },
        {
          label: `E[${sy.replace(/[_^{}]/g, '')}]`,
          value: formatNumber(ey, 3),
          color: DATA_COLORS.secondary,
        },
        { label: 'E[suma]', value: formatNumber(es, 3), color: DATA_COLORS.tertiary },
        { label: 'Repeticiones', value: String(sim.n) },
        { label: 'Promedio de la suma', value: sim.n > 0 ? formatNumber(mx + my, 3) : 'sin datos' },
      ]}
      legend={[
        { label: sx.replace(/[_^{}]/g, ''), color: DATA_COLORS.primary, shape: 'line' },
        { label: sy.replace(/[_^{}]/g, ''), color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Suma', color: DATA_COLORS.tertiary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {sx.replace(/[_^{}]/g, '')}: {vx?.label}. {sy.replace(/[_^{}]/g, '')}: {vy?.label}. Ambas se
        calculan con el mismo resultado del experimento.
      </p>
      <div className={styles.panels}>
        <PmfChart
          source={sourceOf(px, vx?.label ?? '', sx)}
          label={description}
          aspect={0.6}
          color={() => DATA_COLORS.primary}
          markers={[{ x: ex, label: formatNumber(ex, 2), color: DATA_COLORS.text }]}
          showValues={false}
        />
        <PmfChart
          source={sourceOf(py, vy?.label ?? '', sy)}
          label={description}
          aspect={0.6}
          color={() => DATA_COLORS.secondary}
          markers={[{ x: ey, label: formatNumber(ey, 2), color: DATA_COLORS.text }]}
          showValues={false}
        />
      </div>
      <PmfChart
        source={sourceOf(ps, 'suma', `${sx}+${sy}`)}
        label={description}
        aspect={0.3}
        color={() => DATA_COLORS.tertiary}
        markers={[
          {
            x: es,
            label: `${formatNumber(ex, 2)} + ${formatNumber(ey, 2)} = ${formatNumber(es, 2)}`,
            color: DATA_COLORS.text,
          },
        ]}
        showValues={false}
      />
      <ChartSvg label={description} aspect={0.36} minHeight={180} maxHeight={280}>
        {(box) => {
          const xMax = Math.max(50, sim.n);
          const x = scaleLinear()
            .domain([0, xMax])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const lo = Math.min(0, ex, ey) - 1;
          const hi = Math.max(es, ex, ey) + 2;
          const y = scaleLinear()
            .domain([lo, hi])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const series = [
            { key: 'x' as const, color: DATA_COLORS.primary, target: ex },
            { key: 'y' as const, color: DATA_COLORS.secondary, target: ey },
            { key: 's' as const, color: DATA_COLORS.tertiary, target: es },
          ];
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="promedio acumulado"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={5}
                label="repeticiones"
                format={(v) => formatNumber(v, 0)}
              />
              {series.map((serie) => (
                <g key={serie.key}>
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(serie.target)}
                    y2={y(serie.target)}
                    stroke={serie.color}
                    strokeDasharray="5 4"
                    aria-hidden="true"
                  />
                  {sim.history.length > 1 && (
                    <CurvePath
                      points={sim.history.map((p) => ({
                        x: p.n,
                        y: Math.min(hi, Math.max(lo, p[serie.key])),
                      }))}
                      xScale={x}
                      yScale={y}
                      color={serie.color}
                      animate={false}
                    />
                  )}
                </g>
              ))}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
