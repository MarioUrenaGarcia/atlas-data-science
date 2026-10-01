import type { CatalogExample } from '../examples.ts';

/** Catalog entries for the functions of several variables. */
export const MULTIVARIABLE_EXAMPLES: CatalogExample[] = [
  {
    component: 'SurfaceViz',
    title: 'Superficie',
    params: { modo: 'superficie', campos: ['dos-colinas', 'silla', 'ondas'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Curvas de nivel',
    params: { modo: 'curvas', campos: ['gaussiana', 'rosenbrock'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Parciales',
    params: { modo: 'parciales', campos: ['dos-colinas', 'silla'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Gradiente',
    params: { modo: 'gradiente', campos: ['dos-colinas', 'eliptico'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Direccional',
    params: { modo: 'direccional', campos: ['paraboloide', 'ondas'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Tangente',
    params: { modo: 'tangente', campos: ['dos-colinas', 'ondas'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Jacobiana',
    params: { modo: 'jacobiana', mapas: ['polares', 'cuadrado', 'lineal', 'onda'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Hessiana',
    params: { modo: 'hessiana', campos: ['cuadratica-girada', 'silla', 'dos-colinas'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Regla de la cadena',
    params: { modo: 'trayectoria', campos: ['dos-colinas', 'paraboloide'], curvas: ['espiral', 'circulo', 'recta'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Puntos críticos',
    params: { modo: 'criticos', campos: ['min-y-silla', 'dos-colinas', 'ondas'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Integral doble',
    params: {
      modo: 'integral-doble',
      casos: [
        {
          campo: 'paraboloide',
          region: [
            [0, 2],
            [0, 1],
          ],
        },
        {
          campo: 'gaussiana',
          region: [
            [-2, 2],
            [-2, 2],
          ],
        },
      ],
    },
  },
  {
    component: 'SurfaceViz',
    title: 'Coordenadas',
    params: { modo: 'coordenadas', sistemas: ['polares', 'cilindricas', 'esfericas'] },
  },
  { component: 'SurfaceViz', title: 'Integral gaussiana', params: { modo: 'gaussiana' } },
  {
    component: 'SurfaceViz',
    title: 'Cálculo matricial',
    params: { modo: 'matricial', casos: ['alargada', 'redonda', 'minimos-cuadrados'] },
  },
  {
    component: 'SurfaceViz',
    title: 'Lagrange',
    params: { modo: 'lagrange', casos: ['suma-circulo', 'paraboloide-recta', 'producto-elipse'] },
  },
  { component: 'SurfaceViz', title: 'KKT', params: { modo: 'kkt', casos: ['triangulo', 'semiplano'] } },
];
