import type { QuestionCaseId } from './schema.ts';

export interface Refinement {
  /** Question the refinement answers, shown as a chip. */
  prompt: string;
  /** Fragment added to the analytic question. */
  fragment: string;
}

export interface Definition {
  label: string;
  unit: string;
  /** Value of each entity under this operational definition. */
  values: readonly number[];
  /** True when a smaller value is better (for example, mortality). */
  lowerIsBetter?: boolean;
  decimals: number;
}

export interface QuestionCase {
  business: string;
  /** Index of the definition that matches the refined analytic question. */
  analytic: number;
  refinements: readonly Refinement[];
  entities: readonly string[];
  definitions: readonly Definition[];
}

/** Hospital data by risk stratum, used to compute crude and risk adjusted mortality. */
export const HOSPITAL_STRATA = {
  names: ['Hospital A', 'Hospital B', 'Hospital C', 'Hospital D', 'Hospital E'],
  lowPatients: [800, 300, 600, 450, 700],
  lowDeaths: [16, 3, 9, 9, 7],
  highPatients: [200, 700, 400, 550, 300],
  highDeaths: [30, 84, 52, 55, 42],
};

function hospitalDefinitions(): Definition[] {
  const s = HOSPITAL_STRATA;
  const patients = s.names.map((_, i) => (s.lowPatients[i] ?? 0) + (s.highPatients[i] ?? 0));
  const deaths = s.names.map((_, i) => (s.lowDeaths[i] ?? 0) + (s.highDeaths[i] ?? 0));
  const allLow = s.lowPatients.reduce((a, b) => a + b, 0);
  const allHigh = s.highPatients.reduce((a, b) => a + b, 0);
  const rateLow = s.lowDeaths.reduce((a, b) => a + b, 0) / allLow;
  const rateHigh = s.highDeaths.reduce((a, b) => a + b, 0) / allHigh;
  const overall = deaths.reduce((a, b) => a + b, 0) / patients.reduce((a, b) => a + b, 0);
  // Indirect standardization: observed deaths over the deaths expected with
  // the network-wide rate of each risk stratum, rescaled by the overall rate.
  const adjusted = s.names.map((_, i) => {
    const expected = (s.lowPatients[i] ?? 0) * rateLow + (s.highPatients[i] ?? 0) * rateHigh;
    return (100 * overall * (deaths[i] ?? 0)) / expected;
  });
  return [
    {
      label: 'Mortalidad bruta',
      unit: '%',
      values: deaths.map((d, i) => (100 * d) / (patients[i] ?? 1)),
      lowerIsBetter: true,
      decimals: 1,
    },
    {
      label: 'Mortalidad ajustada por riesgo',
      unit: '%',
      values: adjusted,
      lowerIsBetter: true,
      decimals: 1,
    },
    {
      label: 'Proporción de pacientes de alto riesgo',
      unit: '%',
      values: s.names.map((_, i) => (100 * (s.highPatients[i] ?? 0)) / (patients[i] ?? 1)),
      decimals: 0,
    },
  ];
}

export const QUESTION_CASES: Record<QuestionCaseId, QuestionCase> = {
  sucursales: {
    business: '¿Cuál es nuestra mejor sucursal?',
    analytic: 3,
    refinements: [
      { prompt: '¿Para qué decisión?', fragment: 'Para decidir dónde abrir la siguiente tienda,' },
      {
        prompt: '¿Qué unidades?',
        fragment: 'entre las 5 sucursales con más de 2 años de operación,',
      },
      {
        prompt: '¿Medido cómo?',
        fragment: '¿cuál genera más utilidad por empleado',
      },
      { prompt: '¿En qué periodo?', fragment: 'durante los últimos 12 meses' },
      { prompt: '¿Comparado con qué?', fragment: 'frente al promedio de la cadena?' },
    ],
    entities: ['Centro', 'Norte', 'Sur', 'Poniente', 'Oriente'],
    definitions: [
      {
        label: 'Ventas totales',
        unit: 'millones de pesos',
        values: [48, 41, 30, 36, 25],
        decimals: 0,
      },
      {
        label: 'Ventas por empleado',
        unit: 'miles de pesos',
        values: [1200, 1171, 1500, 1029, 1250],
        decimals: 0,
      },
      { label: 'Crecimiento anual', unit: '%', values: [2, 9, 4, 15, 6], decimals: 0 },
      {
        label: 'Utilidad por empleado',
        unit: 'miles de pesos',
        values: [168, 199, 195, 134, 213],
        decimals: 0,
      },
    ],
  },
  escuelas: {
    business: '¿Qué escuelas lo están haciendo mejor?',
    analytic: 3,
    refinements: [
      { prompt: '¿Para qué decisión?', fragment: 'Para elegir qué prácticas replicar,' },
      { prompt: '¿Qué unidades?', fragment: 'entre las 5 secundarias públicas de la zona,' },
      { prompt: '¿Medido cómo?', fragment: '¿cuáles tienen mayor aprendizaje' },
      { prompt: '¿En qué periodo?', fragment: 'en el ciclo escolar más reciente' },
      {
        prompt: '¿Comparado con qué?',
        fragment: 'una vez descontado el nivel con el que ingresan sus estudiantes?',
      },
    ],
    entities: ['Esc. 1', 'Esc. 2', 'Esc. 3', 'Esc. 4', 'Esc. 5'],
    definitions: [
      {
        label: 'Promedio en el examen',
        unit: 'puntos',
        values: [612, 575, 548, 590, 531],
        decimals: 0,
      },
      { label: 'Porcentaje de aprobación', unit: '%', values: [88, 81, 76, 90, 72], decimals: 0 },
      {
        label: 'Mejora frente al ciclo anterior',
        unit: 'puntos',
        values: [4, 21, 10, -3, 15],
        decimals: 0,
      },
      {
        label: 'Ganancia sobre el puntaje de ingreso',
        unit: 'puntos',
        values: [7, 27, 29, 2, 11],
        decimals: 0,
      },
    ],
  },
  hospitales: {
    business: '¿Qué hospital de la red tiene la mejor atención?',
    analytic: 1,
    refinements: [
      { prompt: '¿Para qué decisión?', fragment: 'Para asignar el programa de mejora de calidad,' },
      { prompt: '¿Qué unidades?', fragment: 'entre los 5 hospitales de la red,' },
      { prompt: '¿Medido cómo?', fragment: '¿cuál tiene menor mortalidad a 30 días' },
      { prompt: '¿En qué periodo?', fragment: 'entre los egresos del último año,' },
      {
        prompt: '¿Comparado con qué?',
        fragment: 'tomando en cuenta el riesgo de sus pacientes?',
      },
    ],
    entities: HOSPITAL_STRATA.names,
    definitions: hospitalDefinitions(),
  },
};

/** Index of the best entity under a definition. */
export function bestIndex(definition: Definition): number {
  let best = 0;
  definition.values.forEach((v, i) => {
    const current = definition.values[best] ?? v;
    if (definition.lowerIsBetter ? v < current : v > current) best = i;
  });
  return best;
}
