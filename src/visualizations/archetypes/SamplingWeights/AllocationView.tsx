import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  allocate,
  allocationSequence,
  optimalAllocation,
  stratifiedVariance,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { AllocationConfig } from './schema.ts';
import styles from './SamplingWeights.module.css';

type Rule = 'proporcional' | 'neyman' | 'igual' | 'optima';

const RULE_LABELS: Record<Rule, string> = {
  proporcional: 'Proporcional',
  neyman: 'De Neyman',
  igual: 'Igual en cada estrato',
  optima: 'Óptima con costos',
};

const RULE_NAMES: Record<Rule, string> = {
  proporcional: 'proporcional',
  neyman: 'de Neyman',
  igual: 'igual',
  optima: 'óptima con costos',
};

const UNITS_PER_SECOND = 8;
const MAX_DOTS = 60;

function allotmentFor(rule: Rule, n: number, sizes: number[], sds: number[], costs: number[]) {
  if (rule === 'optima') return optimalAllocation(n, sizes, sds, costs);
  return allocate(rule, n, sizes, sds);
}

/** Units of a stratified sample handed to the strata one by one under an allocation rule. */
export function AllocationView({ config, title }: { config: AllocationConfig; title: string }) {
  const strata = config.estratos;
  const sizes = strata.map((s) => s.N);
  const sds = strata.map((s) => s.S);
  const costs = strata.map((s) => s.costo ?? 1);
  const hasCosts = strata.some((s) => s.costo !== undefined);
  const N = sizes.reduce((a, b) => a + b, 0);
  const rules: Rule[] = hasCosts
    ? ['proporcional', 'neyman', 'optima', 'igual']
    : ['proporcional', 'neyman', 'igual'];
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de muestra total',
        symbol: 'n',
        min: strata.length,
        max: Math.min(N, Math.max(config.n * 4, 100)),
        step: 1,
        default: config.n,
      },
      {
        type: 'select',
        key: 'regla',
        label: 'Regla de asignación',
        options: rules.map((r) => ({ value: r, label: RULE_LABELS[r] })),
        default: config.asignacion,
      },
    ],
    // The frontmatter is static after mounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const rule = String(parameters.values.regla) as Rule;
  const allotment = allotmentFor(rule, n, sizes, sds, costs);
  const order = allocationSequence(allotment);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [given, update] = useResettableState(`${n}|${rule}|${run}`, () =>
    reducedMotion ? order.length : 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(order.length, value + 1)),
    stepMany: (count) => update((value) => Math.min(order.length, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(UNITS_PER_SECOND, order.length / 6),
    done: given >= order.length,
  });
  const current = sizes.map(() => 0);
  order.slice(0, given).forEach((h) => (current[h] = (current[h] ?? 0) + 1));
  const complete = given >= order.length;
  const lastStratum = given > 0 ? (order[given - 1] ?? 0) : 0;

  const variances = sds.map((s) => s * s);
  const varianceOf = (r: Rule) =>
    stratifiedVariance(sizes, variances, allotmentFor(r, n, sizes, sds, costs));
  const totalCost = allotment.reduce((acc, nh, h) => acc + nh * (costs[h] ?? 1), 0);
  const currentVariance = varianceOf(rule);
  const scoreTex = (h: number) => {
    const s = strata[h];
    if (!s) return '';
    if (rule === 'proporcional')
      return `n_{${h + 1}} = n\\,\\frac{N_{${h + 1}}}{N} = ${n} \\cdot \\frac{${s.N}}{${N}} \\approx ${allotment[h]}`;
    if (rule === 'igual')
      return `n_{${h + 1}} = \\frac{n}{H} = \\frac{${n}}{${strata.length}} \\approx ${allotment[h]}`;
    const sum = strata.reduce(
      (acc, t) => acc + (t.N * t.S) / (rule === 'optima' ? Math.sqrt(t.costo ?? 1) : 1),
      0,
    );
    if (rule === 'optima')
      return `n_{${h + 1}} = n\\,\\frac{N_{${h + 1}} S_{${h + 1}}/\\sqrt{c_{${h + 1}}}}{\\sum_k N_k S_k/\\sqrt{c_k}} = ${n} \\cdot \\frac{${formatNumber((s.N * s.S) / Math.sqrt(s.costo ?? 1), 1)}}{${formatNumber(sum, 1)}} \\approx ${allotment[h]}`;
    // Strata whose Neyman share exceeds their size are taken whole; the rest of
    // the sample is shared among the other strata with the same rule.
    const census = strata.map((t, k) => (allotment[k] ?? 0) >= t.N && (n * t.N * t.S) / sum > t.N);
    if (census[h])
      return `n_{${h + 1}} = ${n} \\cdot \\frac{${formatNumber(s.N * s.S, 1)}}{${formatNumber(sum, 1)}} = ${formatNumber((n * s.N * s.S) / sum, 1)} > N_{${h + 1}} \\Rightarrow n_{${h + 1}} = N_{${h + 1}} = ${s.N}\\ \\text{(censo)}`;
    if (census.some(Boolean)) {
      const taken = strata.reduce((acc, t, k) => acc + (census[k] ? t.N : 0), 0);
      const rest = strata.reduce((acc, t, k) => acc + (census[k] ? 0 : t.N * t.S), 0);
      return `n_{${h + 1}} = (n - n_{\\text{censo}})\\,\\frac{N_{${h + 1}} S_{${h + 1}}}{\\sum_{k \\notin \\text{censo}} N_k S_k} = ${n - taken} \\cdot \\frac{${formatNumber(s.N * s.S, 1)}}{${formatNumber(rest, 1)}} = ${formatNumber(((n - taken) * s.N * s.S) / rest, 1)} \\approx ${allotment[h]}`;
    }
    return `n_{${h + 1}} = n\\,\\frac{N_{${h + 1}} S_{${h + 1}}}{\\sum_k N_k S_k} = ${n} \\cdot \\frac{${formatNumber(s.N * s.S, 1)}}{${formatNumber(sum, 1)}} \\approx ${allotment[h]}`;
  };
  const header = complete
    ? `\\operatorname{Var}(\\bar{y}_{st}) = \\sum_h W_h^2 \\Big(1 - \\frac{n_h}{N_h}\\Big)\\frac{S_h^2}{n_h} = ${formatNumber(currentVariance, 4)}`
    : scoreTex(lastStratum);
  const unitText = config.unidad ? ` ${config.unidad}²` : '';

  const description =
    `${RULE_LABELS[rule]}: ${n} unidades repartidas entre ${strata.length} estratos como ${allotment
      .map((a, h) => `${strata[h]?.nombre} ${a}`)
      .join(', ')}. ` + `Varianza de la media estratificada ${formatNumber(currentVariance, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        ...strata.map((s, h) => ({
          label: `${s.nombre}: N = ${s.N}, S = ${formatNumber(s.S, 2)}`,
          value: `n = ${current[h]}${complete ? '' : ` de ${allotment[h]}`}`,
          color: seriesColor(h),
        })),
        ...rules.map((r) => ({
          label: `Varianza con asignación ${RULE_NAMES[r]}`,
          value: `${formatNumber(varianceOf(r), 4)}${unitText}`,
          ...(r === rule ? { color: DATA_COLORS.highlight } : {}),
        })),
        ...(hasCosts
          ? [{ label: 'Costo total de la muestra', value: formatNumber(totalCost, 0) }]
          : []),
      ]}
      legend={strata.map((s, h) => ({ label: s.nombre, color: seriesColor(h) }))}
      description={description}
      dataTable={{
        caption: 'Asignación por estrato',
        columns: ['Estrato', 'N_h', 'S_h', ...(hasCosts ? ['Costo'] : []), 'n_h'],
        rows: strata.map((s, h) => [
          s.nombre,
          String(s.N),
          formatNumber(s.S, 2),
          ...(hasCosts ? [formatNumber(s.costo ?? 1, 1)] : []),
          String(allotment[h]),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {complete
          ? `Asignación ${RULE_NAMES[rule]} terminada`
          : `Se entrega la unidad ${given} de ${n} al estrato ${strata[lastStratum]?.nombre ?? ''}`}
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={360}
        margins={{ top: 34, bottom: 28, left: 12, right: 12 }}
      >
        {(box) => {
          const gap = 10;
          const usable = box.inner.width - gap * (strata.length - 1);
          const maxS = Math.max(...sds);
          let x = box.inner.left;
          const height = box.inner.height;
          return (
            <g>
              {strata.map((s, h) => {
                const width = Math.max(28, (usable * s.N) / N);
                const left = x;
                x += width + gap;
                const spread = (height * 0.85 * s.S) / maxS;
                const count = current[h] ?? 0;
                const shown = Math.min(count, MAX_DOTS);
                const columns = Math.max(1, Math.floor((width - 8) / 11));
                return (
                  <g key={h}>
                    <rect
                      x={left}
                      y={box.inner.top + height - spread}
                      width={width}
                      height={spread}
                      fill={seriesColor(h)}
                      fillOpacity={h === lastStratum && !complete && given > 0 ? 0.32 : 0.16}
                      stroke={seriesColor(h)}
                    />
                    <text
                      x={left + width / 2}
                      y={box.inner.top - 18}
                      textAnchor="middle"
                      className={styles.label}
                    >
                      {s.nombre}
                    </text>
                    <text
                      x={left + width / 2}
                      y={box.inner.top - 5}
                      textAnchor="middle"
                      className={styles.labelMuted}
                    >
                      {`n = ${count}`}
                    </text>
                    {Array.from({ length: shown }, (_, i) => (
                      <circle
                        key={i}
                        cx={left + 8 + (i % columns) * 11}
                        cy={box.inner.top + height - 8 - Math.floor(i / columns) * 11}
                        r={4}
                        fill={seriesColor(h)}
                        stroke={DATA_COLORS.text}
                        strokeWidth={0.6}
                      />
                    ))}
                    {count > MAX_DOTS && (
                      <text
                        x={left + width / 2}
                        y={box.inner.top + height / 2}
                        textAnchor="middle"
                        className={styles.label}
                      >
                        {`+${count - MAX_DOTS}`}
                      </text>
                    )}
                  </g>
                );
              })}
              <text
                x={box.inner.left}
                y={box.inner.top + height + 18}
                className={styles.labelMuted}
              >
                Ancho de cada bloque: tamaño del estrato. Altura: desviación estándar dentro del
                estrato.
              </text>
            </g>
          );
        }}
      </ChartSvg>
      <ChartSvg
        label="Varianza de la media estratificada con cada regla"
        aspect={0.22}
        minHeight={130}
        maxHeight={170}
        margins={{ left: 150, top: 8, bottom: 30 }}
      >
        {(box) => {
          const values = rules.map(varianceOf);
          const xs = scaleLinear()
            .domain([0, Math.max(...values) * 1.1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const band = box.inner.height / rules.length;
          return (
            <g>
              <Axis
                scale={xs}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={4}
                label="Varianza de la media estratificada"
              />
              {rules.map((r, i) => (
                <g key={r}>
                  <text
                    x={box.inner.left - 6}
                    y={box.inner.top + band * (i + 0.5)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className={styles.label}
                  >
                    {RULE_LABELS[r]}
                  </text>
                  <rect
                    x={box.inner.left}
                    y={box.inner.top + band * i + 3}
                    width={Math.max(1, xs(values[i] ?? 0) - box.inner.left)}
                    height={band - 6}
                    fill={r === rule ? DATA_COLORS.highlight : DATA_COLORS.neutral}
                    fillOpacity={0.8}
                  />
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
