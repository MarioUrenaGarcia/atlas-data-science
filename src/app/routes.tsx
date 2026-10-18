import { lazyWithRecovery } from './staleDeploy.ts';
import type { RouteObject } from 'react-router-dom';
import { Layout } from './layout/Layout.tsx';

const HomePage = lazyWithRecovery(() => import('../pages/HomePage/HomePage.tsx'));
const ModulesPage = lazyWithRecovery(() => import('../pages/ModulesPage/ModulesPage.tsx'));
const ModulePage = lazyWithRecovery(() => import('../pages/ModulePage/ModulePage.tsx'));
const ConceptPage = lazyWithRecovery(() => import('../pages/ConceptPage/ConceptPage.tsx'));
const MapPage = lazyWithRecovery(() => import('../pages/MapPage/MapPage.tsx'));
const RoadmapPage = lazyWithRecovery(() => import('../pages/RoadmapPage/RoadmapPage.tsx'));
const RoutesPage = lazyWithRecovery(() => import('../pages/RoutesPage/RoutesPage.tsx'));
const RouteDetailPage = lazyWithRecovery(
  () => import('../pages/RouteDetailPage/RouteDetailPage.tsx'),
);
const SearchPage = lazyWithRecovery(() => import('../pages/SearchPage/SearchPage.tsx'));
const GlossaryPage = lazyWithRecovery(() => import('../pages/GlossaryPage/GlossaryPage.tsx'));
const NotationPage = lazyWithRecovery(() => import('../pages/NotationPage/NotationPage.tsx'));
const ProgressPage = lazyWithRecovery(() => import('../pages/ProgressPage/ProgressPage.tsx'));
const AboutPage = lazyWithRecovery(() => import('../pages/AboutPage/AboutPage.tsx'));
const NotFoundPage = lazyWithRecovery(() => import('../pages/NotFoundPage/NotFoundPage.tsx'));

// The catalog exists only in development; production builds drop this branch.
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'catalogo',
        Component: lazyWithRecovery(() => import('../visualizations/catalog/CatalogPage.tsx')),
      },
    ]
  : [];

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'modulos', Component: ModulesPage },
      { path: 'modulo/:numero', Component: ModulePage },
      { path: 'concepto/:id', Component: ConceptPage },
      { path: 'mapa', Component: MapPage },
      { path: 'roadmap/:id', Component: RoadmapPage },
      { path: 'rutas', Component: RoutesPage },
      { path: 'rutas/:id', Component: RouteDetailPage },
      { path: 'buscar', Component: SearchPage },
      { path: 'glosario', Component: GlossaryPage },
      { path: 'notacion', Component: NotationPage },
      { path: 'progreso', Component: ProgressPage },
      { path: 'acerca', Component: AboutPage },
      ...devRoutes,
      { path: '*', Component: NotFoundPage },
    ],
  },
];
