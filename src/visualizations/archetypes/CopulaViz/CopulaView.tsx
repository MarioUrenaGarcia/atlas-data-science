import { formatNumber } from '../../../lib/format/number.ts';
import { COPULA_INFO, tailDependence } from '../../../lib/probability/copula.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CopulaViz.module.css';
import { PairScatter } from './PairScatter.tsx';
import type { CopulaVizConfig } from './schema.ts';
import { useCopulaSample } from './useCopulaSample.ts';

const CORNER = 0.5;

interface CopulaViewProps {
  title: string;
  conceptId: string;
  config: CopulaVizConfig;
}

/**
 * A copula as a cloud of simulated pairs (U, V) in the unit square: both
 * edge histograms stay flat because each coordinate is uniform, while the
 * shape of the cloud carries all of the dependence. The shaded quadrant is
 * the event U <= 1/2, V <= 1/2, whose probability C(1/2, 1/2) is 1/4 under
 * independence and grows with positive dependence.
 */
export function CopulaView({ title, conceptId, config }: CopulaViewProps) {
  const { family, tau, theta, pairs, total, playback, seed, parameters, values } = useCopulaSample(
    config,
    conceptId,
  );
  const n = pairs.length;
  const inCorner = pairs.filter(([u, v]) => u <= CORNER && v <= CORNER).length;
  const c = n > 0 ? inCorner / n : 0;
  const tails = tailDependence(family, theta);
  const f = (v: number) => formatNumber(v, 3);
  const header =
    n === 0
      ? `C(u, v) = P(U \\le u,\\ V \\le v), \\qquad U, V \\sim \\mathrm{U}(0, 1)`
      : `C(\\tfrac{1}{2}, \\tfrac{1}{2}) \\approx \\frac{${inCorner}}{${n}} = ${f(c)} \\qquad (\\text{independencia: } 0.25)`;
  const description =
    `Cópula ${COPULA_INFO[family].label.toLowerCase()} con tau de Kendall ${f(tau)}. ` +
    `${n} pares simulados; fracción en el cuadrante U ≤ 1/2, V ≤ 1/2: ${f(c)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Pares simulados', value: `${n} de ${total}` },
        { label: 'C(1/2, 1/2) estimada', value: f(c), color: DATA_COLORS.highlight },
        { label: 'tau de Kendall', value: f(tau) },
        {
          label: family === 'gaussiana' ? 'Correlación ρ' : 'Parámetro θ',
          value: family === 'independiente' ? 'sin parámetro' : f(theta),
        },
        { label: 'Dependencia de cola inferior', value: f(tails.lower) },
        { label: 'Dependencia de cola superior', value: f(tails.upper) },
      ]}
      legend={[
        { label: 'Pares (U, V)', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Cuadrante U ≤ 1/2, V ≤ 1/2', color: DATA_COLORS.highlight },
        { label: 'Histograma de U (arriba) y de V (derecha)', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PairScatter
        points={pairs}
        xDomain={[0, 1]}
        yDomain={[0, 1]}
        xLabel="u"
        yLabel="v"
        label={description}
        underlay={({ x, y }) => (
          <rect
            aria-hidden="true"
            x={x(0)}
            y={y(CORNER)}
            width={x(CORNER) - x(0)}
            height={y(0) - y(CORNER)}
            fill={DATA_COLORS.highlight}
            fillOpacity={0.15}
          />
        )}
      />
      <p className={styles.caption}>
        Los histogramas de los bordes quedan planos: cada coordenada es uniforme sin importar la
        familia. Toda la dependencia está en la forma de la nube.
      </p>
    </VizFrame>
  );
}
