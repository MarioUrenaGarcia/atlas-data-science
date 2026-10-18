import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { COPULA_INFO } from '../../../lib/probability/copula.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import styles from './CopulaViz.module.css';
import { PairScatter } from './PairScatter.tsx';
import type { CopulaVizConfig } from './schema.ts';
import { useCopulaSample } from './useCopulaSample.ts';

const LAST_RADIUS = 6;

interface SklarViewProps {
  title: string;
  conceptId: string;
  config: CopulaVizConfig;
}

/**
 * Sklar's construction: each simulated pair (U, V) of the copula (left) is
 * sent through the quantile functions of the chosen marginals, X = F^{-1}(U)
 * and Y = G^{-1}(V) (right). The pairs keep their ranks, so the dependence is
 * the same, while the marginals become whatever F and G prescribe.
 */
export function SklarView({ title, conceptId, config }: SklarViewProps) {
  const { family, tau, pairs, playback, seed, parameters, values } = useCopulaSample(
    config,
    conceptId,
  );
  const margins = useMemo(() => {
    const specX = DISTRIBUTION_SPECS[config.margenX ?? 'exponencial'];
    const specY = DISTRIBUTION_SPECS[config.margenY ?? 'normal'];
    const fx = specX.create(specValues(specX, config.parametrosX));
    const fy = specY.create(specValues(specY, config.parametrosY));
    return {
      fx,
      fy,
      labelX: specX.label,
      labelY: specY.label,
      xDomain: plotWindow([fx], specX.domain, specX.discrete),
      yDomain: plotWindow([fy], specY.domain, specY.discrete),
    };
  }, [config.margenX, config.margenY, config.parametrosX, config.parametrosY]);
  const mapped = useMemo(
    () =>
      pairs.map(
        ([u, v]) =>
          [
            margins.fx.quantile(Math.min(1 - 1e-9, Math.max(1e-9, u))),
            margins.fy.quantile(Math.min(1 - 1e-9, Math.max(1e-9, v))),
          ] as [number, number],
      ),
    [pairs, margins],
  );
  const last = pairs.at(-1);
  const lastMapped = mapped.at(-1);
  const f = (v: number) => formatNumber(v, 3);
  const header =
    last && lastMapped
      ? `(u, v) = (${f(last[0])}, ${f(last[1])}) \\;\\mapsto\\; (x, y) = \\big(F^{-1}(${f(last[0])}),\\ G^{-1}(${f(last[1])})\\big) = (${f(lastMapped[0])}, ${f(lastMapped[1])})`
      : `H(x, y) = C\\big(F(x),\\ G(y)\\big)`;
  const nameX = config.nombreX ?? 'x';
  const nameY = config.nombreY ?? 'y';
  const description =
    `Cópula ${COPULA_INFO[family].label.toLowerCase()} con tau ${f(tau)} y marginales ${margins.labelX.toLowerCase()} y ${margins.labelY.toLowerCase()}. ` +
    `${pairs.length} pares simulados.`;
  const lastColor = (count: number) => (k: number) =>
    k === count - 1 ? DATA_COLORS.highlight : DATA_COLORS.primary;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Pares simulados', value: String(pairs.length) },
        { label: 'tau de Kendall', value: f(tau) },
        {
          label: 'Último u, v',
          value: last ? `${f(last[0])}, ${f(last[1])}` : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Último x, y',
          value: lastMapped ? `${f(lastMapped[0])}, ${f(lastMapped[1])}` : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        { label: 'Marginal de X', value: margins.labelX },
        { label: 'Marginal de Y', value: margins.labelY },
      ]}
      legend={[
        { label: 'Pares simulados', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Último par en ambos paneles', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <figure className={styles.panel}>
          <PairScatter
            points={pairs}
            xDomain={[0, 1]}
            yDomain={[0, 1]}
            xLabel="u"
            yLabel="v"
            label={`Cópula. ${description}`}
            color={lastColor(pairs.length)}
            maxHeight={340}
            overlay={({ x, y }) =>
              last ? (
                <circle
                  aria-hidden="true"
                  cx={x(last[0])}
                  cy={y(last[1])}
                  r={LAST_RADIUS}
                  fill={DATA_COLORS.highlight}
                />
              ) : null
            }
          />
          <figcaption className={styles.caption}>Cópula: marginales uniformes</figcaption>
        </figure>
        <figure className={styles.panel}>
          <PairScatter
            points={mapped}
            xDomain={margins.xDomain}
            yDomain={margins.yDomain}
            xLabel={nameX}
            yLabel={nameY}
            label={`Distribución conjunta con las marginales elegidas. ${description}`}
            color={lastColor(mapped.length)}
            maxHeight={340}
            overlay={({ x, y }) =>
              lastMapped ? (
                <circle
                  aria-hidden="true"
                  cx={x(lastMapped[0])}
                  cy={y(lastMapped[1])}
                  r={LAST_RADIUS}
                  fill={DATA_COLORS.highlight}
                />
              ) : null
            }
          />
          <figcaption className={styles.caption}>
            Marginales {margins.labelX.toLowerCase()} y {margins.labelY.toLowerCase()}
          </figcaption>
        </figure>
      </div>
      <p className={styles.caption}>
        Cada punto de la izquierda se lleva a la derecha con las funciones cuantil de las
        marginales. El orden de los puntos no cambia, así que la dependencia es la misma.
      </p>
    </VizFrame>
  );
}
