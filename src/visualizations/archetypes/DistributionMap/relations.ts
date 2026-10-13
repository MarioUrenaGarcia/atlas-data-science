import type { DistributionId } from '../../shared/distributionIds.ts';

/** Kinds of relation, each drawn with its own color. */
export type RelationKind = 'caso-particular' | 'limite' | 'construccion' | 'mezcla';

export const KIND_LABELS: Record<RelationKind, string> = {
  'caso-particular': 'Caso particular',
  limite: 'Límite',
  construccion: 'Construcción',
  mezcla: 'Mezcla',
};

export const KINDS: readonly RelationKind[] = [
  'caso-particular',
  'limite',
  'construccion',
  'mezcla',
];

export interface MapNode {
  id: DistributionId;
  label: string;
  /** Concept page of the distribution. */
  concept: string;
  /** Center in the 1000 by 610 drawing. */
  x: number;
  y: number;
}

export type RelationView =
  | { componente: 'DistributionExplorer'; parametros: Record<string, unknown> }
  | { componente: 'ContinuousGenesis'; parametros: Record<string, unknown> }
  | { componente: 'DistributionGenesis'; parametros: Record<string, unknown> };

export interface Relation {
  id: string;
  from: DistributionId;
  to: DistributionId;
  kind: RelationKind;
  title: string;
  text: string;
  view: RelationView;
}

export const NODES: readonly MapNode[] = [
  { id: 'bernoulli', label: 'Bernoulli', concept: 'distribucion-de-bernoulli', x: 90, y: 60 },
  { id: 'binomial', label: 'Binomial', concept: 'distribucion-binomial', x: 280, y: 60 },
  {
    id: 'beta-binomial',
    label: 'Beta-binomial',
    concept: 'distribucion-beta-binomial',
    x: 470,
    y: 60,
  },
  { id: 'beta', label: 'Beta', concept: 'distribucion-beta', x: 690, y: 60 },
  { id: 'uniforme', label: 'Uniforme', concept: 'distribucion-uniforme-continua', x: 880, y: 60 },
  { id: 'poisson', label: 'Poisson', concept: 'distribucion-de-poisson', x: 280, y: 190 },
  { id: 'normal', label: 'Normal', concept: 'distribucion-normal', x: 560, y: 190 },
  { id: 't', label: 't de Student', concept: 'distribucion-t-de-student', x: 740, y: 190 },
  { id: 'cauchy', label: 'Cauchy', concept: 'distribucion-de-cauchy', x: 910, y: 190 },
  { id: 'geometrica', label: 'Geométrica', concept: 'distribucion-geometrica', x: 90, y: 320 },
  {
    id: 'binomial-negativa',
    label: 'Binomial negativa',
    concept: 'distribucion-binomial-negativa',
    x: 280,
    y: 320,
  },
  { id: 'lognormal', label: 'Lognormal', concept: 'distribucion-lognormal', x: 470, y: 320 },
  {
    id: 'chi-cuadrada',
    label: 'Chi-cuadrada',
    concept: 'distribucion-chi-cuadrada',
    x: 690,
    y: 320,
  },
  { id: 'f', label: 'F de Snedecor', concept: 'distribucion-f-de-snedecor', x: 900, y: 320 },
  { id: 'rayleigh', label: 'Rayleigh', concept: 'distribucion-de-rayleigh', x: 90, y: 450 },
  { id: 'weibull', label: 'Weibull', concept: 'distribucion-de-weibull', x: 280, y: 450 },
  { id: 'exponencial', label: 'Exponencial', concept: 'distribucion-exponencial', x: 470, y: 450 },
  { id: 'gamma', label: 'Gamma', concept: 'distribucion-gamma', x: 690, y: 450 },
  { id: 'erlang', label: 'Erlang', concept: 'distribucion-de-erlang', x: 900, y: 450 },
  { id: 'laplace', label: 'Laplace', concept: 'distribucion-de-laplace', x: 470, y: 560 },
];

const explorer = (parametros: Record<string, unknown>): RelationView => ({
  componente: 'DistributionExplorer',
  parametros: { muestras: false, ...parametros },
});

export const RELATIONS: readonly Relation[] = [
  {
    id: 'binomial-poisson',
    from: 'binomial',
    to: 'poisson',
    kind: 'limite',
    title: 'Binomial y Poisson',
    text: 'Con muchos intentos y probabilidad pequeña, la binomial con parámetros n y p casi coincide con la Poisson de λ = np. Al bajar p o subir n con el producto fijo, las dos se pegan más.',
    view: explorer({
      distribucion: 'binomial',
      valores: { n: 50, p: 0.05 },
      referencia: {
        distribucion: 'poisson',
        enlace: { lambda: { de: ['n', 'p'] } },
        etiqueta: 'Poisson con λ = np',
        visible: true,
      },
    }),
  },
  {
    id: 't-normal',
    from: 't',
    to: 'normal',
    kind: 'limite',
    title: 't de Student y normal',
    text: 'Con pocos grados de libertad la t tiene colas más gruesas que la normal. Al subir ν se vuelve la normal estándar, porque el denominador aleatorio se estabiliza en 1.',
    view: explorer({
      distribucion: 't',
      valores: { nu: 2 },
      region: 'derecha',
      desde: 3,
      referencia: {
        distribucion: 'normal',
        valores: { mu: 0, sigma: 1 },
        etiqueta: 'Normal estándar',
        visible: true,
      },
    }),
  },
  {
    id: 'gamma-exponencial',
    from: 'exponencial',
    to: 'gamma',
    kind: 'caso-particular',
    title: 'Exponencial dentro de la gamma',
    text: 'La gamma con forma 1 es exactamente la exponencial con la misma tasa. Al subir la forma las curvas se separan: la gamma pasa a medir la espera hasta un evento posterior al primero.',
    view: explorer({
      distribucion: 'gamma',
      valores: { alpha: 1, beta: 0.5 },
      referencia: {
        distribucion: 'exponencial',
        enlace: { lambda: { de: ['beta'] } },
        etiqueta: 'Exponencial con λ = β',
        visible: true,
      },
    }),
  },
  {
    id: 'chi-gamma',
    from: 'chi-cuadrada',
    to: 'gamma',
    kind: 'caso-particular',
    title: 'Chi-cuadrada dentro de la gamma',
    text: 'La chi-cuadrada con k grados es una gamma con forma k/2 y tasa 1/2, es decir, escala 2. Las dos curvas quedan una encima de la otra para cualquier k.',
    view: explorer({
      distribucion: 'chi-cuadrada',
      valores: { k: 6 },
      dominio: [0, 30],
      referencia: {
        distribucion: 'gamma',
        valores: { beta: 0.5 },
        enlace: { alpha: { de: ['k'], factor: 0.5 } },
        etiqueta: 'Gamma con forma k/2 y escala 2',
        visible: true,
      },
    }),
  },
  {
    id: 'weibull-exponencial',
    from: 'weibull',
    to: 'exponencial',
    kind: 'caso-particular',
    title: 'Weibull y exponencial',
    text: 'Con forma k = 1 la Weibull es la exponencial de tasa 1/λ: el riesgo de falla es constante. Al mover k el riesgo empieza a cambiar con la edad y las curvas se separan.',
    view: explorer({
      distribucion: 'weibull',
      valores: { k: 1, lambda: 2 },
      dominio: [0, 10],
      referencia: {
        distribucion: 'exponencial',
        enlace: { lambda: { de: ['lambda'], potencias: [-1] } },
        etiqueta: 'Exponencial con tasa 1/λ',
        visible: true,
      },
    }),
  },
  {
    id: 'bernoulli-binomial',
    from: 'bernoulli',
    to: 'binomial',
    kind: 'caso-particular',
    title: 'Bernoulli y binomial',
    text: 'Una binomial con n = 1 es una Bernoulli. Cada intento adicional suma otra Bernoulli independiente con la misma p.',
    view: explorer({
      distribucion: 'binomial',
      valores: { n: 1, p: 0.3 },
      referencia: {
        distribucion: 'bernoulli',
        enlace: { p: { de: ['p'] } },
        etiqueta: 'Bernoulli con la misma p',
        visible: true,
      },
    }),
  },
  {
    id: 'beta-uniforme',
    from: 'uniforme',
    to: 'beta',
    kind: 'caso-particular',
    title: 'Uniforme dentro de la beta',
    text: 'Con parámetros a = b = 1 la beta es plana: es la uniforme en [0, 1]. Al mover a o b la masa se inclina hacia uno de los extremos.',
    view: explorer({
      distribucion: 'beta',
      valores: { a: 1, b: 1 },
      referencia: {
        distribucion: 'uniforme',
        valores: { a: 0, b: 1 },
        etiqueta: 'Uniforme en [0, 1]',
        visible: true,
      },
    }),
  },
  {
    id: 'chi-f',
    from: 'chi-cuadrada',
    to: 'f',
    kind: 'construccion',
    title: 'Chi-cuadrada y F',
    text: 'La F es el cociente de dos chi-cuadradas independientes, cada una dividida entre sus grados de libertad. Por eso aparece al comparar dos varianzas en el análisis de varianza.',
    view: {
      componente: 'ContinuousGenesis',
      parametros: { proceso: 'cociente-f', valores: { d1: 5, d2: 20 } },
    },
  },
  {
    id: 'normal-chi',
    from: 'normal',
    to: 'chi-cuadrada',
    kind: 'construccion',
    title: 'Normal y chi-cuadrada',
    text: 'La suma de los cuadrados de k normales estándar independientes es una chi-cuadrada con k grados de libertad.',
    view: {
      componente: 'ContinuousGenesis',
      parametros: { proceso: 'suma-cuadrados', valores: { k: 3, m: 0 } },
    },
  },
  {
    id: 'normal-lognormal',
    from: 'normal',
    to: 'lognormal',
    kind: 'construccion',
    title: 'Normal y lognormal',
    text: 'Si Y es normal, X = e^Y es lognormal; a la inversa, el logaritmo de una lognormal es normal. Aparece cuando muchos factores se multiplican en lugar de sumarse.',
    view: explorer({ distribucion: 'lognormal', valores: { mu: 0, sigma: 0.5 }, dominio: [0, 6] }),
  },
  {
    id: 'binomial-normal',
    from: 'binomial',
    to: 'normal',
    kind: 'limite',
    title: 'Binomial y normal',
    text: 'Con n grande la binomial se parece a la normal con media np y varianza np(1 - p), por el teorema central del límite. Con n = 40 y p = 0.5 la normal tiene media 20 y desviación 3.16.',
    view: explorer({
      distribucion: 'binomial',
      valores: { n: 40, p: 0.5 },
      fijos: ['n', 'p'],
      referencia: {
        distribucion: 'normal',
        valores: { mu: 20, sigma: 3.162 },
        etiqueta: 'Normal con media 20 y desviación 3.16',
        visible: true,
      },
    }),
  },
  {
    id: 'poisson-normal',
    from: 'poisson',
    to: 'normal',
    kind: 'limite',
    title: 'Poisson y normal',
    text: 'Con λ grande la Poisson se parece a la normal con media λ y varianza λ. La curva punteada sigue a λ: con λ = 1 la diferencia es enorme y con λ = 30 casi desaparece.',
    view: explorer({
      distribucion: 'poisson',
      valores: { lambda: 4 },
      referencia: {
        distribucion: 'normal',
        enlace: { mu: { de: ['lambda'] }, sigma: { de: ['lambda'], potencias: [0.5] } },
        etiqueta: 'Normal con media λ y varianza λ',
        visible: true,
      },
    }),
  },
  {
    id: 't-cauchy',
    from: 't',
    to: 'cauchy',
    kind: 'caso-particular',
    title: 't con un grado y Cauchy',
    text: 'La t de Student con un grado de libertad es la Cauchy estándar, tan pesada en las colas que no tiene media.',
    view: explorer({
      distribucion: 't',
      valores: { nu: 1 },
      referencia: {
        distribucion: 'cauchy',
        valores: { x0: 0, gamma: 1 },
        etiqueta: 'Cauchy estándar',
        visible: true,
      },
    }),
  },
  {
    id: 'geometrica-bn',
    from: 'geometrica',
    to: 'binomial-negativa',
    kind: 'caso-particular',
    title: 'Geométrica y binomial negativa',
    text: 'La binomial negativa con r = 1 cuenta los fracasos antes del primer éxito: es la geométrica desplazada una unidad, porque la geométrica cuenta los intentos. Con r éxitos es la suma de r esperas geométricas.',
    view: explorer({ distribucion: 'binomial-negativa', valores: { r: 1, p: 0.4 } }),
  },
  {
    id: 'poisson-bn',
    from: 'poisson',
    to: 'binomial-negativa',
    kind: 'mezcla',
    title: 'Poisson con tasa gamma',
    text: 'Si la tasa de una Poisson varía según una gamma, el conteo resultante es binomial negativo: tiene la misma media que una Poisson pero más varianza. Aquí la binomial negativa con r = 3 y p = 0.4 tiene media 4.5 y varianza 11.25, frente a la Poisson de media 4.5.',
    view: explorer({
      distribucion: 'binomial-negativa',
      valores: { r: 3, p: 0.4 },
      fijos: ['r', 'p'],
      referencia: {
        distribucion: 'poisson',
        valores: { lambda: 4.5 },
        etiqueta: 'Poisson con la misma media',
        visible: true,
      },
    }),
  },
  {
    id: 'binomial-betabinomial',
    from: 'binomial',
    to: 'beta-binomial',
    kind: 'mezcla',
    title: 'Binomial con probabilidad beta',
    text: 'Si la probabilidad de éxito de una binomial varía según una beta, el conteo es beta-binomial: misma media que la binomial con p = 0.5 pero más dispersión.',
    view: explorer({
      distribucion: 'beta-binomial',
      valores: { n: 10, alpha: 2, beta: 2 },
      fijos: ['n', 'alpha', 'beta'],
      referencia: {
        distribucion: 'binomial',
        valores: { n: 10, p: 0.5 },
        etiqueta: 'Binomial con p = 0.5',
        visible: true,
      },
    }),
  },
  {
    id: 'beta-betabinomial',
    from: 'beta',
    to: 'beta-binomial',
    kind: 'mezcla',
    title: 'Beta como distribución de p',
    text: 'La beta-binomial usa una beta para describir la incertidumbre sobre la probabilidad de éxito; cuanto más concentrada es la beta, más se parece el conteo a una binomial.',
    view: explorer({ distribucion: 'beta', valores: { a: 2, b: 2 } }),
  },
  {
    id: 'exponencial-laplace',
    from: 'exponencial',
    to: 'laplace',
    kind: 'construccion',
    title: 'Exponencial y Laplace',
    text: 'La diferencia de dos exponenciales independientes con la misma tasa es una Laplace: una exponencial reflejada hacia los dos lados del cero.',
    view: {
      componente: 'ContinuousGenesis',
      parametros: { proceso: 'diferencia-exponenciales', valores: { mu: 0, b: 1 } },
    },
  },
  {
    id: 'weibull-rayleigh',
    from: 'weibull',
    to: 'rayleigh',
    kind: 'caso-particular',
    title: 'Weibull y Rayleigh',
    text: 'Con forma k = 2 la Weibull es una Rayleigh de escala σ = λ/√2: la distancia al origen de un punto con coordenadas normales.',
    view: explorer({
      distribucion: 'weibull',
      valores: { k: 2, lambda: 2 },
      fijos: ['k'],
      dominio: [0, 10],
      referencia: {
        distribucion: 'rayleigh',
        enlace: { sigma: { de: ['lambda'], factor: 0.7071 } },
        etiqueta: 'Rayleigh con σ = λ/√2',
        visible: true,
      },
    }),
  },
  {
    id: 'gamma-erlang',
    from: 'gamma',
    to: 'erlang',
    kind: 'caso-particular',
    title: 'Gamma de forma entera y Erlang',
    text: 'Con forma entera k la gamma es la Erlang: la suma de k esperas exponenciales con la misma tasa.',
    view: {
      componente: 'ContinuousGenesis',
      parametros: { proceso: 'llegadas', valores: { k: 3, lambda: 1 } },
    },
  },
];
