import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { hiddenPopulationNetwork, snowballWaves } from '../../../lib/sampling/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SamplingProcess.module.css';
import type { SnowballConfig } from './schema.ts';

const WAVES_PER_SECOND = 0.7;

/** Recruitment of a hidden population through referrals along a social network. */
export function SnowballView({
  config,
  title,
  conceptId,
}: {
  config: SnowballConfig;
  title: string;
  conceptId: string;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'semillas',
      label: 'Semillas iniciales',
      min: 1,
      max: 8,
      step: 1,
      default: config.semillas,
    },
    {
      type: 'number',
      key: 'cupones',
      label: 'Referencias por persona',
      symbol: 'c',
      min: 1,
      max: 6,
      step: 1,
      default: config.cupones,
    },
  ];
  const parameters = useParameters(definitions);
  const seedsCount = Number(parameters.values.semillas);
  const coupons = Number(parameters.values.cupones);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const network = useMemo(
    () =>
      hiddenPopulationNetwork(
        config.tamano,
        config.proporcion,
        config.homofilia,
        new Random(seed.seed),
      ),
    [config.tamano, config.proporcion, config.homofilia, seed.seed],
  );
  const members = network.member.map((m, i) => (m ? i : -1)).filter((i) => i >= 0);
  const degree = network.neighbors.map((list) => list.filter((j) => network.member[j]).length);
  const [run, setRun] = useState(0);
  const waves = useMemo(() => {
    const random = new Random(seed.seed + 97 + run);
    const seeds = random.sample(members, Math.min(seedsCount, members.length));
    return snowballWaves(network, seeds, coupons, config.olas, new Random(seed.seed + 13 + run));
    // members derives from network
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, seedsCount, coupons, config.olas, seed.seed, run]);
  const [shown, update] = useResettableState<number>(
    `${seedsCount}|${coupons}|${seed.seed}|${run}`,
    () => 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(waves.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: WAVES_PER_SECOND,
    done: shown >= waves.length,
  });
  const waveOf = new Map<number, number>();
  const referrer = new Map<number, number>();
  waves.slice(0, shown).forEach((wave, w) =>
    wave.recruits.forEach((r, j) => {
      waveOf.set(r, w);
      referrer.set(r, wave.referrers[j] ?? -1);
    }),
  );
  const recruited = [...waveOf.keys()];
  const meanDegree = (list: number[]) =>
    list.length === 0 ? Number.NaN : list.reduce((a, i) => a + (degree[i] ?? 0), 0) / list.length;
  const current = waves[shown - 1];
  const header =
    shown <= 1
      ? `\\text{ola } 0:\\ ${current?.recruits.length ?? 0}\\ \\text{semillas}`
      : `\\text{ola } ${shown - 1}:\\ ${waves[shown - 2]?.recruits.length ?? 0}\\ \\text{reclutadores} \\times \\text{hasta } ${coupons}\\ \\text{referencias} \\Rightarrow ${current?.recruits.length ?? 0}\\ \\text{nuevos};\\quad n = ${recruited.length}`;
  const name = config.nombreMiembro.toLowerCase();
  const description =
    `Red de ${config.tamano} personas, ${members.length} de ellas ${name}s. Tras ${shown - 1} olas se reclutaron ${recruited.length}. ` +
    `Contactos promedio con otros ${name}s: ${formatNumber(meanDegree(recruited), 2)} entre los reclutados y ${formatNumber(meanDegree(members), 2)} entre todos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: `${config.nombreMiembro}s en la red`, value: String(members.length) },
        { label: 'Reclutados', value: String(recruited.length), color: DATA_COLORS.highlight },
        {
          label: 'Porcentaje alcanzado',
          value: `${formatNumber((recruited.length / Math.max(1, members.length)) * 100, 1)} %`,
        },
        {
          label: 'Contactos promedio de los reclutados',
          value: formatNumber(meanDegree(recruited), 2),
          color: DATA_COLORS.secondary,
        },
        {
          label: `Contactos promedio de todos los ${name}s`,
          value: formatNumber(meanDegree(members), 2),
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: config.nombreMiembro, color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Resto de la red', color: DATA_COLORS.neutral, shape: 'circle' },
        ...waves.slice(0, shown).map((_, w) => ({
          label: w === 0 ? 'Semillas' : `Ola ${w}`,
          color: seriesColor(w + 2),
          shape: 'circle' as const,
        })),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={280}
        maxHeight={480}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const px = (i: number) => box.inner.left + (network.x[i] ?? 0) * box.inner.width;
          const py = (i: number) => box.inner.top + (network.y[i] ?? 0) * box.inner.height;
          const r = Math.max(3, Math.min(box.inner.width, box.inner.height) / 70);
          return (
            <g>
              <g aria-hidden="true">
                {network.neighbors.flatMap((list, i) =>
                  list
                    .filter((j) => j > i)
                    .map((j) => (
                      <line
                        key={`${i}-${j}`}
                        x1={px(i)}
                        y1={py(i)}
                        x2={px(j)}
                        y2={py(j)}
                        stroke={DATA_COLORS.muted}
                        strokeOpacity={0.18}
                      />
                    )),
                )}
                {recruited.map((i) => {
                  const from = referrer.get(i) ?? -1;
                  return from < 0 ? null : (
                    <line
                      key={`r${i}`}
                      x1={px(from)}
                      y1={py(from)}
                      x2={px(i)}
                      y2={py(i)}
                      stroke={seriesColor((waveOf.get(i) ?? 0) + 2)}
                      strokeWidth={2.5}
                    />
                  );
                })}
              </g>
              <g aria-hidden="true">
                {network.member.map((m, i) => {
                  const w = waveOf.get(i);
                  return (
                    <circle
                      key={i}
                      cx={px(i)}
                      cy={py(i)}
                      r={w === undefined ? r : r * 1.35}
                      fill={
                        w !== undefined
                          ? seriesColor(w + 2)
                          : m
                            ? DATA_COLORS.primary
                            : DATA_COLORS.neutral
                      }
                      fillOpacity={w !== undefined ? 1 : m ? 0.55 : 0.25}
                      stroke={w !== undefined ? DATA_COLORS.text : 'none'}
                    />
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>Las líneas gruesas muestran quién refirió a quién.</p>
    </VizFrame>
  );
}
