import {
  discProbability,
  formsTriangle,
  meetingProbability,
  realRootsProbability,
  TRIANGLE_PROBABILITY,
  type GeometricScenario,
} from '../../../lib/probability/geometric.ts';
import type { Random } from '../../../lib/random/index.ts';

export interface ScenarioSettings {
  wait: number;
  horizon: number;
  radius: number;
  byRadius: boolean;
  bMax: number;
  cMax: number;
}

type Polygon = [number, number][];

export interface ScenarioModel {
  domain: { x: [number, number]; y: [number, number] };
  xLabel: string;
  yLabel: string;
  sample: (random: Random) => [number, number];
  hit: (x: number, y: number) => boolean;
  exact: number;
  /** Favorable region as polygons in data coordinates. */
  region: Polygon[];
  /** Outline of the sampling region when it is not the whole rectangle. */
  outline?: Polygon;
  /** Converts the hit share into the quantity being estimated (for pi, 4 times the share). */
  target: { name: string; latex: string; factor: number; exact: number };
  /** LaTeX of the exact probability as an area ratio. */
  areaLatex: string;
}

const CIRCLE_STEPS = 90;

function circle(radius: number, from = 0, to = 2 * Math.PI): Polygon {
  return Array.from({ length: CIRCLE_STEPS + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / CIRCLE_STEPS;
    return [radius * Math.cos(t), radius * Math.sin(t)];
  });
}

const number = (value: number, digits = 2) => Number(value.toFixed(digits)).toString();

export function scenarioModel(id: GeometricScenario, s: ScenarioSettings): ScenarioModel {
  switch (id) {
    case 'encuentro': {
      const { wait: w, horizon: T } = s;
      const exact = meetingProbability(w, T);
      const probability = { name: 'P(se encuentran)', latex: 'P', factor: 1, exact };
      return {
        domain: { x: [0, T], y: [0, T] },
        xLabel: 'llegada de la primera persona (min)',
        yLabel: 'llegada de la segunda (min)',
        sample: (r) => [r.uniform(0, T), r.uniform(0, T)],
        hit: (x, y) => Math.abs(x - y) <= w,
        exact,
        region: [
          [
            [0, 0],
            [Math.min(w, T), 0],
            [T, Math.max(0, T - w)],
            [T, T],
            [Math.max(0, T - w), T],
            [0, Math.min(w, T)],
          ],
        ],
        target: probability,
        areaLatex: `\\frac{${T}^2 - (${T} - ${number(w, 0)})^2}{${T}^2}`,
      };
    }
    case 'cuarto-de-circulo':
      return {
        domain: { x: [0, 1], y: [0, 1] },
        xLabel: 'x',
        yLabel: 'y',
        sample: (r) => [r.uniform(), r.uniform()],
        hit: (x, y) => x * x + y * y <= 1,
        exact: Math.PI / 4,
        region: [[[0, 0], ...circle(1, 0, Math.PI / 2)]],
        target: { name: 'Estimación de π', latex: '\\hat{\\pi}', factor: 4, exact: Math.PI },
        areaLatex: '\\frac{\\pi / 4}{1}',
      };
    case 'disco': {
      const { radius, byRadius } = s;
      const exact = discProbability(radius);
      return {
        domain: { x: [-1, 1], y: [-1, 1] },
        xLabel: 'x',
        yLabel: 'y',
        sample: (r) => {
          // Uniform in area needs the square root; a uniform radius crowds the center.
          const rho = byRadius ? r.uniform() : Math.sqrt(r.uniform());
          const theta = r.uniform(0, 2 * Math.PI);
          return [rho * Math.cos(theta), rho * Math.sin(theta)];
        },
        hit: (x, y) => x * x + y * y <= radius * radius,
        exact,
        region: [circle(radius)],
        outline: circle(1),
        target: { name: 'P(distancia < r)', latex: 'P', factor: 1, exact },
        areaLatex: `\\frac{\\pi (${number(radius)})^2}{\\pi \\cdot 1^2}`,
      };
    }
    case 'varilla-rota':
      return {
        domain: { x: [0, 1], y: [0, 1] },
        xLabel: 'primer corte U',
        yLabel: 'segundo corte V',
        sample: (r) => [r.uniform(), r.uniform()],
        hit: formsTriangle,
        exact: TRIANGLE_PROBABILITY,
        region: [
          [
            [0, 0.5],
            [0.5, 0.5],
            [0.5, 1],
          ],
          [
            [0.5, 0],
            [0.5, 0.5],
            [1, 0.5],
          ],
        ],
        target: { name: 'P(triángulo)', latex: 'P', factor: 1, exact: TRIANGLE_PROBABILITY },
        areaLatex: '\\frac{2 \\cdot \\tfrac{1}{8}}{1}',
      };
    case 'raices-reales': {
      const { bMax, cMax } = s;
      const exact = realRootsProbability(bMax, cMax);
      const curve: Polygon = Array.from({ length: CIRCLE_STEPS + 1 }, (_, i) => {
        const b = (bMax * i) / CIRCLE_STEPS;
        return [b, Math.min(cMax, (b * b) / 4)];
      });
      return {
        domain: { x: [0, bMax], y: [0, cMax] },
        xLabel: 'coeficiente b',
        yLabel: 'coeficiente c',
        sample: (r) => [r.uniform(0, bMax), r.uniform(0, cMax)],
        hit: (b, c) => b * b >= 4 * c,
        exact,
        region: [[[0, 0], ...curve, [bMax, 0]]],
        target: { name: 'P(raíces reales)', latex: 'P', factor: 1, exact },
        areaLatex: `\\frac{\\text{área bajo } c = b^2/4}{${number(bMax)} \\cdot ${number(cMax)}}`,
      };
    }
  }
}
