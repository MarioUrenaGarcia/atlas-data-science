import { formatNumber } from '../../../../lib/format/number.ts';
import type { AlgorithmDefinition } from '../types.ts';
import { NewtonScene } from './NewtonScene.tsx';
import { ROOT_FUNCTION_OPTIONS, ROOT_FUNCTIONS } from './rootFunctions.ts';

export interface NewtonState {
  functionId: string;
  x: number;
  iteration: number;
  tolerance: number;
  maxIterations: number;
  line: number;
  history: number[];
  status: 'buscando' | 'convergio' | 'derivada-nula' | 'diverge';
}

const DIVERGENCE_LIMIT = 1e6;

export const newton: AlgorithmDefinition<NewtonState> = {
  id: 'newton-raphson',
  label: 'Método de Newton-Raphson',
  pseudocode: [
    'repetir hasta |f(x)| < tolerancia:',
    "    si f'(x) = 0: detenerse",
    "    x := x - f(x) / f'(x)",
    'regresar x',
  ],
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
      key: 'x0',
      label: 'Punto inicial',
      symbol: 'x₀',
      min: -4,
      max: 4,
      step: 0.05,
      default: 2.5,
    },
    {
      type: 'number',
      key: 'tolerancia',
      label: 'Exponente de la tolerancia 10ᵏ',
      symbol: 'k',
      min: -12,
      max: -1,
      step: 1,
      default: -10,
    },
  ],
  init: (values) => {
    const fn = ROOT_FUNCTIONS[String(values.funcion)] ?? ROOT_FUNCTIONS.cubica;
    return {
      functionId: fn?.id ?? 'cubica',
      x: Number(values.x0),
      iteration: 0,
      tolerance: 10 ** Number(values.tolerancia),
      maxIterations: 50,
      line: 0,
      history: [],
      status: 'buscando',
    };
  },
  step: (state) => {
    if (state.status !== 'buscando') return state;
    const fn = ROOT_FUNCTIONS[state.functionId];
    if (!fn) return state;
    const fx = fn.f(state.x);
    if (Math.abs(fx) < state.tolerance) return { ...state, line: 3, status: 'convergio' };
    const slope = fn.derivative(state.x);
    if (Math.abs(slope) < 1e-14) return { ...state, line: 1, status: 'derivada-nula' };
    const next = state.x - fx / slope;
    const iteration = state.iteration + 1;
    const status =
      !Number.isFinite(next) ||
      Math.abs(next) > DIVERGENCE_LIMIT ||
      iteration >= state.maxIterations
        ? 'diverge'
        : 'buscando';
    return { ...state, x: next, iteration, line: 2, history: [...state.history, state.x], status };
  },
  done: (state) => state.status !== 'buscando',
  line: (state) => state.line,
  variables: (state) => {
    const fn = ROOT_FUNCTIONS[state.functionId];
    return [
      { name: 'iteración', value: String(state.iteration) },
      { name: 'x', value: formatNumber(state.x, 12) },
      { name: 'f(x)', value: fn ? formatNumber(fn.f(state.x), 4) : '' },
      { name: "f'(x)", value: fn ? formatNumber(fn.derivative(state.x), 4) : '' },
    ];
  },
  describe: (state) => {
    const base = `Iteración ${state.iteration}: x = ${formatNumber(state.x, 10)}.`;
    switch (state.status) {
      case 'convergio':
        return `${base} El valor de la función ya es menor que la tolerancia.`;
      case 'derivada-nula':
        return `${base} La derivada es cero: la tangente es horizontal y no corta al eje.`;
      case 'diverge':
        return `${base} Las iteraciones se alejan o no convergen desde este punto inicial.`;
      default:
        return base;
    }
  },
  Scene: NewtonScene,
};
