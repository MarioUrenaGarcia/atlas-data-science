import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  covariance,
  kendallTau,
  linearRegression,
  mean,
  pearson,
  spearman,
} from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { generatePreset, PRESET_LABELS, type Point } from './presets.ts';
import { ScatterChart, type ClickMode } from './ScatterChart.tsx';
import { SCATTER_MEASURES, type ScatterPlaygroundConfig, type ScatterPreset } from './schema.ts';

const POINTS_PER_SECOND = 8;

interface ScatterState {
  points: Point[];
  revealed: number;
}

export default function ScatterPlayground({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as ScatterPlaygroundConfig;
  const presets = useMemo(
    () => config.conjuntos ?? [config.conjunto],
    [config.conjuntos, config.conjunto],
  );
  const measures = new Set(config.medidas ?? SCATTER_MEASURES);
  const labels = config.etiquetas ?? { x: 'x', y: 'y' };

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(presets.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'conjunto',
              label: 'Conjunto de datos',
              options: presets.map((preset) => ({ value: preset, label: PRESET_LABELS[preset] })),
              default: config.conjunto,
            },
          ]
        : []),
      {
        type: 'select',
        key: 'modo',
        label: 'Al hacer clic en la gráfica',
        options: [
          { value: 'mover', label: 'Arrastrar puntos' },
          { value: 'agregar', label: 'Agregar puntos' },
          { value: 'quitar', label: 'Quitar puntos' },
        ],
        default: 'mover',
      },
      {
        type: 'toggle',
        key: 'recta',
        label: 'Recta de mínimos cuadrados',
        default: config.recta ?? true,
      },
      { type: 'toggle', key: 'residuos', label: 'Residuos', default: config.residuos ?? false },
      {
        type: 'toggle',
        key: 'cuadrados',
        label: 'Cuadrados de los residuos',
        default: config.cuadrados ?? false,
      },
      {
        type: 'toggle',
        key: 'medias',
        label: 'Medias de x y de y',
        default: config.medias ?? false,
      },
    ],
    [presets, config.conjunto, config.recta, config.residuos, config.cuadrados, config.medias],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | boolean>;
  const preset = (presets.length > 1 ? String(values.conjunto) : config.conjunto) as ScatterPreset;
  const mode = String(values.modo) as ClickMode;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState<ScatterState>(`${preset}|${seed.seed}|${run}`, () => ({
    points: generatePreset(preset, config.puntos ?? 24, new Random(seed.seed)),
    revealed: 0,
  }));

  const playback = usePlayback({
    step: () =>
      update((previous) => ({
        ...previous,
        revealed: Math.min(previous.points.length, previous.revealed + 1),
      })),
    reset: () => setRun((value) => value + 1),
    rate: POINTS_PER_SECOND,
    done: state.revealed >= state.points.length,
  });

  const visible = state.points.slice(0, state.revealed);
  const xs = visible.map((point) => point.x);
  const ys = visible.map((point) => point.y);
  const enough = visible.length >= 3;
  const fit = enough ? linearRegression(xs, ys) : null;
  const r = enough ? pearson(xs, ys) : Number.NaN;

  const readouts = [
    { label: 'Número de puntos', value: String(visible.length) },
    ...(measures.has('covarianza')
      ? [
          {
            label: 'Covarianza muestral',
            value: enough ? formatNumber(covariance(xs, ys)) : 'sin datos',
          },
        ]
      : []),
    ...(measures.has('pearson')
      ? [{ label: 'Correlación de Pearson r', value: enough ? formatNumber(r) : 'sin datos' }]
      : []),
    ...(measures.has('spearman')
      ? [
          {
            label: 'Correlación de Spearman',
            value: enough ? formatNumber(spearman(xs, ys)) : 'sin datos',
          },
        ]
      : []),
    ...(measures.has('kendall')
      ? [
          {
            label: 'Tau de Kendall',
            value: enough ? formatNumber(kendallTau(xs, ys)) : 'sin datos',
          },
        ]
      : []),
    ...(measures.has('recta') && fit
      ? [
          {
            label: 'Recta ajustada',
            value: `ŷ = ${formatNumber(fit.intercept, 2)} ${fit.slope < 0 ? '-' : '+'} ${formatNumber(Math.abs(fit.slope), 2)} x`,
            color: DATA_COLORS.primary,
          },
        ]
      : []),
    ...(measures.has('r2') && fit
      ? [{ label: 'Coeficiente de determinación R²', value: formatNumber(fit.rSquared) }]
      : []),
    ...(fit && values.cuadrados
      ? [
          {
            label: 'Suma de cuadrados residual',
            value: formatNumber(fit.residuals.reduce((total, e) => total + e * e, 0)),
            color: DATA_COLORS.highlight,
          },
        ]
      : []),
  ];

  const description = enough
    ? `${visible.length} puntos del conjunto "${PRESET_LABELS[preset]}". Correlación de Pearson ${formatNumber(r)}.` +
      (fit
        ? ` La recta de mínimos cuadrados tiene pendiente ${formatNumber(fit.slope)} y ordenada ${formatNumber(fit.intercept)}.`
        : '')
    : `Se muestran ${visible.length} puntos; se necesitan al menos tres para calcular las medidas.`;

  const reveal = (points: Point[]) => ({ points, revealed: points.length });

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={[
        { label: 'Observaciones', color: DATA_COLORS.tertiary, shape: 'circle' },
        { label: 'Recta de mínimos cuadrados', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Residuos', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Coordenadas de los puntos',
        columns: [labels.x, labels.y],
        rows: visible.map((point) => [formatNumber(point.x, 2), formatNumber(point.y, 2)]),
      }}
    >
      <ScatterChart
        points={visible}
        fit={fit}
        showLine={Boolean(values.recta)}
        showResiduals={Boolean(values.residuos)}
        showSquares={Boolean(values.cuadrados)}
        showMeans={Boolean(values.medias)}
        means={enough ? { x: mean(xs), y: mean(ys) } : null}
        labels={labels}
        mode={mode}
        label={description}
        onMove={(index, point) =>
          update((previous) =>
            reveal(
              previous.points.slice(0, previous.revealed).map((p, i) => (i === index ? point : p)),
            ),
          )
        }
        onAdd={(point) =>
          update((previous) => reveal([...previous.points.slice(0, previous.revealed), point]))
        }
        onRemove={(index) =>
          update((previous) =>
            reveal(previous.points.slice(0, previous.revealed).filter((_, i) => i !== index)),
          )
        }
      />
    </VizFrame>
  );
}
