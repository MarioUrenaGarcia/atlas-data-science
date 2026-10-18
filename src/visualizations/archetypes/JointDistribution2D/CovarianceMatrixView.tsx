import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { covarianceAxes } from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './JointDistribution2D.module.css';
import type { JointDistribution2DConfig } from './schema.ts';
import { normalParameters } from './source.ts';

const MAX_SAMPLES = 600;
const SAMPLES_PER_SECOND = 40;
const ELLIPSE_POINTS = 120;
/** Mahalanobis radii of the drawn ellipses: one and two standard deviations. */
const RADII = [1, 2] as const;
/** The plot shows the window mean plus or minus this many of the largest standard deviation. */
const SPAN = 3.2;

interface Sample {
  points: [number, number][];
  sumX: number;
  sumY: number;
  sumXX: number;
  sumYY: number;
  sumXY: number;
}

interface CovarianceMatrixViewProps {
  title: string;
  conceptId: string;
  config: JointDistribution2DConfig;
}

/**
 * The covariance matrix of a bivariate normal: its diagonal holds the
 * variances and its off-diagonal entry the covariance. The ellipses of one
 * and two standard deviations have axes along the eigenvectors of the matrix,
 * with half-lengths given by the square roots of the eigenvalues. Simulated
 * points accumulate and their sample covariance matrix approaches the true
 * one.
 */
export function CovarianceMatrixView({ title, conceptId, config }: CovarianceMatrixViewProps) {
  const initial = normalParameters(config);
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'sigmaX',
        label: 'Desviación estándar de X',
        symbol: 'σX',
        min: 0.3,
        max: 3,
        step: 0.1,
        digits: 1,
        default: initial.sigmaX,
      },
      {
        type: 'number' as const,
        key: 'sigmaY',
        label: 'Desviación estándar de Y',
        symbol: 'σY',
        min: 0.3,
        max: 3,
        step: 0.1,
        digits: 1,
        default: initial.sigmaY,
      },
      {
        type: 'number' as const,
        key: 'rho',
        label: 'Correlación',
        symbol: 'ρ',
        min: -0.95,
        max: 0.95,
        step: 0.05,
        digits: 2,
        default: initial.rho,
      },
    ],
    [initial.sigmaX, initial.sigmaY, initial.rho],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const sigmaX = values.sigmaX ?? 1;
  const sigmaY = values.sigmaY ?? 1;
  const rho = values.rho ?? 0;
  const { muX, muY } = initial;
  const a = sigmaX * sigmaX;
  const c = sigmaY * sigmaY;
  const b = rho * sigmaX * sigmaY;
  const axes = covarianceAxes(a, b, c);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}|${sigmaX}|${sigmaY}|${rho}`;
  const random = useRandomSource(seed.seed, key);
  const [sample, update] = useResettableState<Sample>(key, () => ({
    points: [],
    sumX: 0,
    sumY: 0,
    sumXX: 0,
    sumYY: 0,
    sumXY: 0,
  }));
  const draw = (count: number) => {
    const generator = random();
    const fresh: [number, number][] = [];
    for (let k = 0; k < Math.min(count, MAX_SAMPLES - sample.points.length); k += 1) {
      // Cholesky factor of the 2 by 2 covariance matrix turns independent normals into correlated ones.
      const z1 = generator.normal();
      const z2 = generator.normal();
      fresh.push([muX + sigmaX * z1, muY + sigmaY * (rho * z1 + Math.sqrt(1 - rho * rho) * z2)]);
    }
    update((previous) => {
      const next = { ...previous, points: [...previous.points, ...fresh] };
      for (const [x, y] of fresh) {
        next.sumX += x;
        next.sumY += y;
        next.sumXX += x * x;
        next.sumYY += y * y;
        next.sumXY += x * y;
      }
      return next;
    });
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: sample.points.length >= MAX_SAMPLES,
  });
  const n = sample.points.length;
  const mx = n > 0 ? sample.sumX / n : 0;
  const my = n > 0 ? sample.sumY / n : 0;
  const sxx = n > 1 ? (sample.sumXX - n * mx * mx) / (n - 1) : 0;
  const syy = n > 1 ? (sample.sumYY - n * my * my) / (n - 1) : 0;
  const sxy = n > 1 ? (sample.sumXY - n * mx * my) / (n - 1) : 0;
  const f = (v: number) => formatNumber(v, 2);
  const header =
    n > 1
      ? `\\boldsymbol{\\Sigma} = \\begin{pmatrix} ${f(a)} & ${f(b)} \\\\ ${f(b)} & ${f(c)} \\end{pmatrix}, \\qquad \\mathbf{S}_{${n}} = \\begin{pmatrix} ${f(sxx)} & ${f(sxy)} \\\\ ${f(sxy)} & ${f(syy)} \\end{pmatrix}`
      : `\\boldsymbol{\\Sigma} = \\begin{pmatrix} \\sigma_X^2 & \\rho\\,\\sigma_X\\sigma_Y \\\\ \\rho\\,\\sigma_X\\sigma_Y & \\sigma_Y^2 \\end{pmatrix} = \\begin{pmatrix} ${f(a)} & ${f(b)} \\\\ ${f(b)} & ${f(c)} \\end{pmatrix}`;
  const description =
    `Normal bivariada con varianzas ${f(a)} y ${f(c)} y covarianza ${f(b)}. ` +
    `Valores propios ${f(axes.values[0])} y ${f(axes.values[1])}. ` +
    `${n} puntos simulados; covarianza muestral ${f(sxy)}.`;
  const half = SPAN * Math.max(sigmaX, sigmaY);
  const ellipse = (r: number) =>
    Array.from({ length: ELLIPSE_POINTS + 1 }, (_, k) => {
      const t = (2 * Math.PI * k) / ELLIPSE_POINTS;
      const u = r * Math.sqrt(Math.max(0, axes.values[0])) * Math.cos(t);
      const v = r * Math.sqrt(Math.max(0, axes.values[1])) * Math.sin(t);
      return {
        x: muX + u * axes.vectors[0][0] + v * axes.vectors[1][0],
        y: muY + u * axes.vectors[0][1] + v * axes.vectors[1][1],
      };
    });

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Var(X), Var(Y)', value: `${f(a)}, ${f(c)}` },
        { label: 'Cov(X, Y)', value: f(b), color: DATA_COLORS.highlight },
        {
          label: 'Valores propios',
          value: `${f(axes.values[0])}, ${f(axes.values[1])}`,
          color: DATA_COLORS.secondary,
        },
        { label: 'Determinante', value: f(a * c - b * b) },
        { label: 'Puntos simulados', value: String(n) },
        { label: 'Covarianza muestral', value: f(sxy), color: DATA_COLORS.primary },
      ]}
      legend={[
        { label: 'Puntos simulados', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Elipses de 1 y 2 desviaciones', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Ejes propios', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.8} minHeight={280} maxHeight={440}>
        {(box) => {
          const side = Math.min(box.inner.width, box.inner.height);
          const offsetX = box.inner.left + (box.inner.width - side) / 2;
          const x = scaleLinear()
            .domain([muX - half, muX + half])
            .range([offsetX, offsetX + side]);
          const y = scaleLinear()
            .domain([muY - half, muY + half])
            .range([box.inner.top + side, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={offsetX}
                gridLength={side}
                ticks={5}
                label="y"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + side}
                ticks={5}
                label="x"
              />
              <g aria-hidden="true">
                {sample.points.map(([px, py], k) => (
                  <circle
                    key={k}
                    cx={x(px)}
                    cy={y(py)}
                    r={2.4}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.45}
                  />
                ))}
              </g>
              {RADII.map((r) => (
                <CurvePath
                  key={r}
                  points={ellipse(r)}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.text}
                  width={r === 1 ? 2.2 : 1.4}
                  dashed={r === 2}
                  animate={false}
                />
              ))}
              <g aria-hidden="true">
                {axes.vectors.map((vector, k) => {
                  const length = 2 * Math.sqrt(Math.max(0, axes.values[k] ?? 0));
                  return (
                    <line
                      key={k}
                      x1={x(muX - length * vector[0])}
                      y1={y(muY - length * vector[1])}
                      x2={x(muX + length * vector[0])}
                      y2={y(muY + length * vector[1])}
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={2}
                    />
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Los ejes de las elipses apuntan en las direcciones de los vectores propios de la matriz de
        covarianza y miden la raíz de sus valores propios. Con correlación cero y varianzas iguales,
        las elipses son círculos.
      </p>
    </VizFrame>
  );
}
