export interface BibliographyEntry {
  autores: string;
  titulo: string;
}

export const BIBLIOGRAPHY = {
  'blitzstein-hwang': { autores: 'Blitzstein y Hwang', titulo: 'Introduction to Probability' },
  'ross-probabilidad': { autores: 'Ross', titulo: 'A First Course in Probability' },
  'ross-procesos': { autores: 'Ross', titulo: 'Introduction to Probability Models' },
  'casella-berger': { autores: 'Casella y Berger', titulo: 'Statistical Inference' },
  wasserman: { autores: 'Wasserman', titulo: 'All of Statistics' },
  degroot: { autores: 'DeGroot y Schervish', titulo: 'Probability and Statistics' },
  'montgomery-doe': { autores: 'Montgomery', titulo: 'Design and Analysis of Experiments' },
  lohr: { autores: 'Lohr', titulo: 'Sampling: Design and Analysis' },
  'gelman-bda': { autores: 'Gelman y coautores', titulo: 'Bayesian Data Analysis' },
  mcelreath: { autores: 'McElreath', titulo: 'Statistical Rethinking' },
  'hastie-esl': {
    autores: 'Hastie, Tibshirani y Friedman',
    titulo: 'The Elements of Statistical Learning',
  },
  'james-isl': {
    autores: 'James, Witten, Hastie y Tibshirani',
    titulo: 'An Introduction to Statistical Learning',
  },
  bishop: { autores: 'Bishop', titulo: 'Pattern Recognition and Machine Learning' },
  murphy: { autores: 'Murphy', titulo: 'Probabilistic Machine Learning' },
  goodfellow: { autores: 'Goodfellow, Bengio y Courville', titulo: 'Deep Learning' },
  'sutton-barto': {
    autores: 'Sutton y Barto',
    titulo: 'Reinforcement Learning: An Introduction',
  },
  'hyndman-fpp': {
    autores: 'Hyndman y Athanasopoulos',
    titulo: 'Forecasting: Principles and Practice',
  },
  'shumway-stoffer': {
    autores: 'Shumway y Stoffer',
    titulo: 'Time Series Analysis and Its Applications',
  },
  'brockwell-davis': {
    autores: 'Brockwell y Davis',
    titulo: 'Introduction to Time Series and Forecasting',
  },
  durrett: { autores: 'Durrett', titulo: 'Probability: Theory and Examples' },
  'karlin-taylor': { autores: 'Karlin y Taylor', titulo: 'A First Course in Stochastic Processes' },
  oksendal: { autores: 'Øksendal', titulo: 'Stochastic Differential Equations' },
  norris: { autores: 'Norris', titulo: 'Markov Chains' },
  strang: { autores: 'Strang', titulo: 'Introduction to Linear Algebra' },
  boyd: { autores: 'Boyd y Vandenberghe', titulo: 'Convex Optimization' },
  'cover-thomas': { autores: 'Cover y Thomas', titulo: 'Elements of Information Theory' },
  pearl: {
    autores: 'Pearl, Glymour y Jewell',
    titulo: 'Causal Inference in Statistics: A Primer',
  },
  'hernan-robins': { autores: 'Hernán y Robins', titulo: 'Causal Inference: What If' },
  'angrist-pischke': { autores: 'Angrist y Pischke', titulo: 'Mostly Harmless Econometrics' },
  agresti: { autores: 'Agresti', titulo: 'Categorical Data Analysis' },
  tsay: { autores: 'Tsay', titulo: 'Analysis of Financial Time Series' },
  molnar: { autores: 'Molnar', titulo: 'Interpretable Machine Learning' },
  kohavi: {
    autores: 'Kohavi, Tang y Xu',
    titulo: 'Trustworthy Online Controlled Experiments',
  },
  tufte: { autores: 'Tufte', titulo: 'The Visual Display of Quantitative Information' },
  coles: {
    autores: 'Coles',
    titulo: 'An Introduction to Statistical Modeling of Extreme Values',
  },
  newman: { autores: 'Newman', titulo: 'Networks' },
} as const satisfies Record<string, BibliographyEntry>;

export type BibliographyKey = keyof typeof BIBLIOGRAPHY;

export const BIBLIOGRAPHY_KEYS = Object.keys(BIBLIOGRAPHY) as [
  BibliographyKey,
  ...BibliographyKey[],
];
