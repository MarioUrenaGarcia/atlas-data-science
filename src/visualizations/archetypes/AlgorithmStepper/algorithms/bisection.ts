import { formatNumber } from '../../../../lib/format/number.ts';
import type { AlgorithmDefinition } from '../types.ts';
import { BisectionScene } from './BisectionScene.tsx';
import { ROOT_FUNCTION_OPTIONS, ROOT_FUNCTIONS } from './rootFunctions.ts';

export interface BisectionState {
  functionId: string;
  a: number;
  b: number;
  fa: number;
  fb: number;
  m: number | null;
  fm: number | null;
  iteration: number;
  tolerance: number;
  /** Pseudocode line of the last executed instruction. */
  line: number;
  history: [number, number][];
  status: 'buscando' | 'convergio' | 'sin-cambio-de-signo';
}

const PSEUDOCODE = [
  'mientras (b - a) / 2 > tolerancia:',
  '    m := (a + b) / 2',
  '    si f(a) · f(m) ≤ 0:',
  '        b := m',
  '    si no:',
  '        a := m',
  'regresar (a + b) / 2',
];

export const bisection: AlgorithmDefinition<BisectionState> = {
  id: 'biseccion',
  label: 'Método de bisección',
  pseudocode: PSEUDOCODE,
  parameters: [
    {
      type: 'select',
      key: 'funcion',
      label: 'Función',
      options: ROOT_FUNCTION_OPTIONS,
      default: 'cubica',
    },
    {
      type: 'number',
      key: 'a',
      label: 'Extremo inicial a',
      symbol: 'a',
      min: -4,
      max: 4,
      step: 0.1,
      default: 0,
    },
    {
      type: 'number',
      key: 'b',
      label: 'Extremo inicial b',
      symbol: 'b',
      min: -4,
      max: 4,
      step: 0.1,
      default: 2.5,
    },
    {
      type: 'number',
      key: 'tolerancia',
      label: 'Exponente de la tolerancia 10ᵏ',
      symbol: 'k',
      min: -10,
      max: -1,
      step: 1,
      default: -6,
    },
  ],
  init: (values) => {
    const fn = ROOT_FUNCTIONS[String(values.funcion)] ?? ROOT_FUNCTIONS.cubica;
    const f = fn?.f ?? ((x: number) => x);
    const a = Math.min(Number(values.a), Number(values.b));
    const b = Math.max(Number(values.a), Number(values.b));
    const fa = f(a);
    const fb = f(b);
    return {
      functionId: fn?.id ?? 'cubica',
      a,
      b,
      fa,
      fb,
      m: null,
      fm: null,
      iteration: 0,
      tolerance: 10 ** Number(values.tolerancia),
      line: 0,
      history: [],
      status: fa * fb > 0 ? 'sin-cambio-de-signo' : 'buscando',
    };
  },
  step: (state) => {
    if (state.status !== 'buscando') return state;
    const fn = ROOT_FUNCTIONS[state.functionId];
    if (!fn) return state;
    if ((state.b - state.a) / 2 <= state.tolerance)
      return { ...state, line: 6, status: 'convergio' };
    const m = (state.a + state.b) / 2;
    const fm = fn.f(m);
    const history: [number, number][] = [...state.history, [state.a, state.b]];
    if (state.fa * fm <= 0) {
      return { ...state, m, fm, b: m, fb: fm, iteration: state.iteration + 1, line: 3, history };
    }
    return { ...state, m, fm, a: m, fa: fm, iteration: state.iteration + 1, line: 5, history };
  },
  done: (state) => state.status !== 'buscando',
  line: (state) => state.line,
  variables: (state) => [
    { name: 'iteración', value: String(state.iteration) },
    { name: 'a', value: formatNumber(state.a, 8) },
    { name: 'b', value: formatNumber(state.b, 8) },
    { name: 'm', value: state.m === null ? 'sin calcular' : formatNumber(state.m, 8) },
    { name: 'f(m)', value: state.fm === null ? 'sin calcular' : formatNumber(state.fm, 4) },
    { name: '(b - a) / 2', value: formatNumber((state.b - state.a) / 2, 4) },
  ],
  describe: (state) => {
    if (state.status === 'sin-cambio-de-signo') {
      return 'f(a) y f(b) tienen el mismo signo: el intervalo inicial no garantiza una raíz y el método no puede empezar.';
    }
    const prefix = `Iteración ${state.iteration}: intervalo [${formatNumber(state.a, 6)}, ${formatNumber(state.b, 6)}] de ancho ${formatNumber(state.b - state.a, 4)}.`;
    return state.status === 'convergio'
      ? `${prefix} El ancho ya es menor que el doble de la tolerancia; la raíz aproximada es ${formatNumber((state.a + state.b) / 2, 8)}.`
      : prefix;
  },
  Scene: BisectionScene,
};
