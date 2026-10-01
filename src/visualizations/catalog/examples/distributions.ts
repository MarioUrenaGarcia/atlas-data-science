import type { CatalogExample } from '../examples.ts';

/** Catalog examples of the distribution visualizations. */
export const DISTRIBUTION_EXAMPLES: CatalogExample[] = [
  { component: 'DistributionGenesis', title: 'Dado', params: { proceso: 'dado' } },
  {
    component: 'DistributionGenesis',
    title: 'Suma de dos dados',
    params: { proceso: 'dado', valores: { k: 2 } },
  },
  { component: 'DistributionGenesis', title: 'Moneda', params: { proceso: 'moneda' } },
  { component: 'DistributionGenesis', title: 'Ensayos', params: { proceso: 'ensayos' } },
  { component: 'DistributionGenesis', title: 'Primer éxito', params: { proceso: 'primer-exito' } },
  { component: 'DistributionGenesis', title: 'r éxitos', params: { proceso: 'r-exitos' } },
  { component: 'DistributionGenesis', title: 'Urna', params: { proceso: 'urna', comparar: true } },
  { component: 'DistributionGenesis', title: 'Llegadas', params: { proceso: 'llegadas' } },
  {
    component: 'DistributionGenesis',
    title: 'Llegadas en rendijas',
    params: { proceso: 'llegadas', rendijas: 20 },
  },
  { component: 'DistributionGenesis', title: 'Ruleta', params: { proceso: 'ruleta' } },
  {
    component: 'DistributionGenesis',
    title: 'Bolas en cajas',
    params: { proceso: 'bolas-en-cajas', vista: 'conjunta' },
  },
  {
    component: 'DistributionGenesis',
    title: 'Beta-binomial',
    params: { proceso: 'beta-binomial' },
  },
  {
    component: 'DistributionGenesis',
    title: 'Ranking',
    params: { proceso: 'ranking', etiquetas: ['de', 'la', 'que', 'el', 'en'] },
  },
  {
    component: 'DistributionGenesis',
    title: 'Mezcla de geométricas',
    params: { proceso: 'mezcla-geometrica' },
  },
  {
    component: 'DistributionGenesis',
    title: 'Ceros inflados',
    params: { proceso: 'ceros-inflados' },
  },
  {
    component: 'DistributionGenesis',
    title: 'Diferencia de llegadas',
    params: { proceso: 'diferencia-de-llegadas', flujos: ['Local', 'Visitante'] },
  },
  {
    component: 'DistributionGenesis',
    title: 'Signos',
    params: { proceso: 'signos', valores: { n: 12 } },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Punto uniforme',
    params: { proceso: 'punto-uniforme' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Suma de uniformes',
    params: { proceso: 'suma-uniformes' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Llegadas exponenciales',
    params: { proceso: 'llegadas', valores: { k: 3 } },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Suma de cuadrados',
    params: { proceso: 'suma-cuadrados', valores: { k: 4, m: 1 } },
  },
  { component: 'ContinuousGenesis', title: 'Cociente t', params: { proceso: 'cociente-t' } },
  { component: 'ContinuousGenesis', title: 'Cociente F', params: { proceso: 'cociente-f' } },
  { component: 'ContinuousGenesis', title: 'Producto', params: { proceso: 'producto' } },
  { component: 'ContinuousGenesis', title: 'Máximo', params: { proceso: 'maximo' } },
  { component: 'ContinuousGenesis', title: 'Mínimo', params: { proceso: 'minimo' } },
  {
    component: 'ContinuousGenesis',
    title: 'Máximo de Pareto',
    params: { proceso: 'maximo-pareto' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Distancia',
    params: { proceso: 'distancia', valores: { nu: 2 } },
  },
  { component: 'ContinuousGenesis', title: 'Faro', params: { proceso: 'faro' } },
  {
    component: 'ContinuousGenesis',
    title: 'Diferencia de exponenciales',
    params: { proceso: 'diferencia-exponenciales' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Estadístico de orden',
    params: { proceso: 'estadistico-de-orden' },
  },
  { component: 'ContinuousGenesis', title: 'Log-momios', params: { proceso: 'log-momios' } },
  {
    component: 'ContinuousGenesis',
    title: 'Potencia de uniforme',
    params: { proceso: 'potencia-de-uniforme' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Mínimo de máximos',
    params: { proceso: 'minimo-de-maximos' },
  },
  { component: 'ContinuousGenesis', title: 'Truncamiento', params: { proceso: 'truncamiento' } },
  { component: 'ContinuousGenesis', title: 'Selección', params: { proceso: 'seleccion' } },
  {
    component: 'ContinuousGenesis',
    title: 'Inverso de gamma',
    params: { proceso: 'inverso-gamma' },
  },
  {
    component: 'ContinuousGenesis',
    title: 'Inverso del cuadrado',
    params: { proceso: 'inverso-cuadrado' },
  },
  { component: 'ContinuousGenesis', title: 'Dirección', params: { proceso: 'direccion' } },
  {
    component: 'ContinuousGenesis',
    title: 'Colas pesadas',
    params: { proceso: 'suma-colas-pesadas' },
  },
];
