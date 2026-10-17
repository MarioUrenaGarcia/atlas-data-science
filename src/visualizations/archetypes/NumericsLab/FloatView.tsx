import { useMemo, useState } from 'react';
import { floatParts, machineEpsilon, type FloatFormat } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './NumericsLab.module.css';
import { exact, sci } from './format.ts';

/** Fraction bits added to the partial significand per animation step. */
const BITS_PER_STEP: Record<FloatFormat, number> = { float32: 1, float64: 4 };
const STEPS_PER_SECOND = 4;

interface FloatViewProps {
  title: string;
  value: number;
  format: FloatFormat;
}

/**
 * Anatomy of a floating point number. The bits of the sign, the exponent and
 * the fraction are shown, and the animation adds the fraction bits one by one
 * so the partial significand approaches the stored value. The readouts compare
 * the stored value with the decimal that was typed.
 */
export function FloatView({ title, value, format }: FloatViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'valor',
        label: 'Número decimal',
        min: -1000,
        max: 1000,
        step: 0.001,
        default: value,
        symbol: 'x',
        digits: 3,
      },
      {
        type: 'select' as const,
        key: 'formato',
        label: 'Formato',
        options: [
          { value: 'float32', label: 'Precisión simple (32 bits)' },
          { value: 'float64', label: 'Precisión doble (64 bits)' },
        ],
        default: format,
      },
    ],
    [value, format],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const x = Number(values.valor);
  const chosen = String(values.formato) as FloatFormat;
  const parts = floatParts(x, chosen);
  const fractionLength = parts.fractionBits.length;
  const totalSteps = Math.ceil(fractionLength / BITS_PER_STEP[chosen]);
  const [step, setStep] = useState(totalSteps);
  const playback = usePlayback({
    step: () => setStep((current) => Math.min(totalSteps, current + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= totalSteps,
  });
  const shownBits = Math.min(fractionLength, step * BITS_PER_STEP[chosen]);
  let partial = parts.kind === 'subnormal' || parts.kind === 'cero' ? 0 : 1;
  for (let i = 0; i < shownBits; i += 1) {
    if (parts.fractionBits[i] === '1') partial += 2 ** -(i + 1);
  }
  const signFactor = parts.sign === 1 ? -1 : 1;
  const partialValue = signFactor * partial * 2 ** parts.exponent;
  const error = Math.abs(parts.stored - x);
  const relative = x === 0 ? 0 : error / Math.abs(x);
  const leading = parts.kind === 'subnormal' || parts.kind === 'cero' ? '0' : '1';
  const header =
    parts.kind === 'normal' || parts.kind === 'subnormal'
      ? `x = (-1)^{${parts.sign}} \\cdot ${leading}.\\underbrace{${parts.fractionBits.slice(0, Math.min(shownBits, 12)) || '0'}${shownBits > 12 ? '\\ldots' : ''}}_{${shownBits}\\ \\text{bits}}{}_2 \\cdot 2^{${parts.exponent}} = ${exact(partialValue, true)}`
      : `x = ${parts.kind === 'cero' ? '0' : parts.kind === 'infinito' ? (parts.sign ? '-\\infty' : '\\infty') : '\\text{NaN}'}`;
  const description =
    `${x} en ${chosen === 'float32' ? 'precisión simple' : 'precisión doble'}: signo ${parts.sign}, exponente ${parts.exponent}, ` +
    `valor guardado ${exact(parts.stored)}, error de redondeo ${sci(error)} (relativo ${sci(relative)}). ` +
    `Con ${shownBits} de ${fractionLength} bits de fracción el valor parcial es ${exact(partialValue)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      graphic="html"
      readouts={[
        { label: 'Valor guardado', value: exact(parts.stored), color: DATA_COLORS.primary },
        { label: 'Error de redondeo', value: sci(error) },
        { label: 'Error relativo', value: sci(relative) },
        { label: 'Épsilon de máquina', value: sci(machineEpsilon(chosen)) },
        { label: 'Distancia al siguiente número (ulp)', value: sci(parts.ulp) },
        { label: 'Bits de fracción usados', value: `${shownBits} de ${fractionLength}` },
      ]}
      legend={[
        { label: 'Signo', color: DATA_COLORS.quaternary },
        { label: 'Exponente', color: DATA_COLORS.secondary },
        { label: 'Fracción', color: DATA_COLORS.primary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.bits} aria-hidden="true">
        <span className={`${styles.bit} ${styles.bitSign}`}>{parts.sign}</span>
        {[...parts.exponentBits].map((bit, i) => (
          <span key={`e${i}`} className={`${styles.bit} ${styles.bitExponent}`}>
            {bit}
          </span>
        ))}
        {[...parts.fractionBits].map((bit, i) => (
          <span
            key={`f${i}`}
            className={`${styles.bit} ${styles.bitFraction} ${i < shownBits ? styles.bitDone : ''}`}
          >
            {bit}
          </span>
        ))}
      </div>
      <FormulaLine
        tex={`\\text{exponente guardado} = ${parseInt(parts.exponentBits, 2)} = ${parts.exponent} + ${chosen === 'float32' ? 127 : 1023}\\ (\\text{sesgo}),\\qquad \\text{guardado} - x = ${sci(parts.stored - x, true)}`}
      />
    </VizFrame>
  );
}
