import { useMemo, useState } from 'react';
import { SUBSTITUTION_CASES } from '../../../lib/calculus/cases.ts';
import { integrate } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const FILL_STEPS = 50;
const STEPS_PER_SECOND = 12;
const PANEL_ASPECT = 0.8;
const MARGIN = 0.15;

interface SubstitutionViewProps {
  title: string;
  cases: readonly string[];
}

/**
 * Change of variables in an integral. As x runs from a to t on the left,
 * u = g(x) runs from g(a) to g(t) on the right, and the two shaded areas stay
 * equal at every moment: the factor g'(x) in the left integrand is exactly
 * the stretching of the axis produced by the substitution.
 */
export function SubstitutionView({ title, cases }: SubstitutionViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Integral',
              options: cases.map((id) => ({ value: id, label: id.replace(/-/g, ' ') })),
              default: cases[0] ?? 'coseno-cuadrado',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const id =
    cases.length > 1
      ? String((parameters.values as Record<string, string>).caso)
      : (cases[0] ?? 'coseno-cuadrado');
  const c = SUBSTITUTION_CASES[id] ?? SUBSTITUTION_CASES['coseno-cuadrado'];
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(FILL_STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= FILL_STEPS,
  });
  if (!c) return null;
  const t = c.a + ((c.b - c.a) * step) / FILL_STEPS;
  const u0 = c.g(c.a);
  const u1 = c.g(t);
  const left = integrate(c.h, c.a, t);
  const right = integrate(c.k, u0, u1);
  const xPad = (c.b - c.a) * MARGIN;
  const uEnd = c.g(c.b);
  const uPad = (uEnd - u0) * MARGIN;
  const description =
    `Con x de ${formatNumber(c.a, 3)} a ${formatNumber(t, 3)}, u = g(x) va de ${formatNumber(u0, 3)} a ${formatNumber(u1, 3)}. ` +
    `Área en x: ${formatNumber(left, 5)}; área en u: ${formatNumber(right, 5)}.`;

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
        { label: 'x recorrido hasta', value: formatNumber(t, 3) },
        { label: 'u = g(x) recorrido hasta', value: formatNumber(u1, 3) },
        {
          label: 'Área en la variable x',
          value: formatNumber(left, 5),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Área en la variable u',
          value: formatNumber(right, 5),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Integrando original en x', color: DATA_COLORS.primary },
        { label: 'Integrando nuevo en u', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${c.leftLatex} = ${c.rightLatex},\\qquad ${c.substitutionLatex},\\qquad ${formatNumber(left, 4)} = ${formatNumber(right, 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Antes: variable x</p>
          <FunctionPlot
            xDomain={[c.a - xPad, c.b + xPad]}
            label={`Integral en x. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={220}
            curves={[{ f: c.h, color: DATA_COLORS.primary, width: 3 }]}
            background={({ x, y }) => (
              <polygon
                aria-hidden="true"
                points={areaPoints(c.h, c.a, t, x, y, 1)}
                fill={DATA_COLORS.primary}
                fillOpacity={0.3}
              />
            )}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Después: variable u = g(x)</p>
          <FunctionPlot
            xDomain={[u0 - uPad, uEnd + uPad]}
            label={`Integral en u. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={220}
            xLabel="u"
            curves={[{ f: c.k, color: DATA_COLORS.secondary, width: 3 }]}
            background={({ x, y }) => (
              <polygon
                aria-hidden="true"
                points={areaPoints(c.k, u0, u1, x, y, 1)}
                fill={DATA_COLORS.secondary}
                fillOpacity={0.3}
              />
            )}
          />
        </div>
      </div>
    </VizFrame>
  );
}
