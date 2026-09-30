import { useMemo, useState } from 'react';
import { IMPROPER_CASES } from '../../../lib/calculus/cases.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const STEPS = 24;
const STEPS_PER_SECOND = 1.5;
/** The moving bound multiplies (or divides) by this factor each step. */
const GROWTH = 1.5;
const VIEW_UPPER = 12;
const Y_MAX = 3;

const NAMES: Record<string, string> = {
  'inverso-cuadrado': '1/x² en [1, ∞)',
  reciproca: '1/x en [1, ∞)',
  exponencial: 'e^(-x) en [0, ∞)',
  'inverso-raiz': '1/raíz de x en (0, 1]',
  'reciproca-singular': '1/x en (0, 1]',
};

interface ImproperViewProps {
  title: string;
  cases: readonly string[];
}

/**
 * An improper integral as a limit of ordinary ones. The moving bound goes to
 * infinity (or to the singular point) and the shaded area is recomputed; the
 * integral converges when those areas approach a finite number.
 */
export function ImproperView({ title, cases }: ImproperViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Integral',
              options: cases.map((id) => ({ value: id, label: NAMES[id] ?? id })),
              default: cases[0] ?? 'inverso-cuadrado',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const id =
    cases.length > 1
      ? String((parameters.values as Record<string, string>).caso)
      : (cases[0] ?? 'inverso-cuadrado');
  const c = IMPROPER_CASES[id] ?? IMPROPER_CASES['inverso-cuadrado'];
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  if (!c) return null;
  const infinite = c.kind === 'infinito';
  const bound = infinite ? (c.a + 1) * GROWTH ** step : c.a / GROWTH ** (step + 1);
  const partial = infinite ? c.F(bound) - c.F(c.a) : c.F(c.a) - c.F(bound);
  const converges = Number.isFinite(c.value);
  const xDomain: [number, number] = infinite ? [c.a - 0.5, c.a + VIEW_UPPER] : [0, c.a + 0.3];
  const shaded: [number, number] = infinite ? [c.a, Math.min(bound, xDomain[1])] : [bound, c.a];
  const description =
    `${NAMES[id] ?? id}: con el límite móvil en ${formatNumber(bound, 4)} el área es ${formatNumber(partial, 4)}. ` +
    (converges
      ? `Las áreas se acercan a ${formatNumber(c.value, 3)}: la integral converge.`
      : 'Las áreas crecen sin cota: la integral diverge.');
  const boundLatex = infinite ? 'b' : '\\varepsilon';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        {
          label: infinite ? 'Límite superior b' : 'Límite inferior ε',
          value: formatNumber(bound, 4),
        },
        {
          label: 'Área hasta el límite móvil',
          value: formatNumber(partial, 5),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Valor de la integral impropia',
          value: converges ? formatNumber(c.value, 4) : 'diverge',
        },
      ]}
      legend={[{ label: 'Área calculada', color: DATA_COLORS.primary }]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${c.latex} = \\lim_{${boundLatex} \\to ${infinite ? '\\infty' : '0^+'}} \\int_{${infinite ? formatNumber(c.a, 0) : '\\varepsilon'}}^{${infinite ? 'b' : formatNumber(c.a, 0)}} f(x)\\,dx,\\qquad ${boundLatex} = ${formatNumber(bound, 4)}:\\ ${formatNumber(partial, 5)}`}
        />
      </p>
      <p className={styles.stage}>
        {converges
          ? 'Las áreas se estabilizan: converge.'
          : 'Las áreas no se estabilizan: diverge.'}
      </p>
      <FunctionPlot
        xDomain={xDomain}
        yDomain={[-0.2, Y_MAX]}
        label={description}
        curves={[{ f: c.f, color: DATA_COLORS.text, width: 2.5, from: infinite ? c.a : 1e-4 }]}
        background={({ x, y }) => (
          <polygon
            aria-hidden="true"
            points={areaPoints((t) => Math.min(c.f(t), Y_MAX * 4), shaded[0], shaded[1], x, y, 1)}
            fill={DATA_COLORS.primary}
            fillOpacity={0.35}
          />
        )}
      />
    </VizFrame>
  );
}
