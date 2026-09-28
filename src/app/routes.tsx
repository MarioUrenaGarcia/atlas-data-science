import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Layout } from './layout/Layout.tsx';

const HomePage = lazy(() => import('../pages/HomePage/HomePage.tsx'));
const ModulesPage = lazy(() => import('../pages/ModulesPage/ModulesPage.tsx'));
const ModulePage = lazy(() => import('../pages/ModulePage/ModulePage.tsx'));
const ConceptPage = lazy(() => import('../pages/ConceptPage/ConceptPage.tsx'));
const MapPage = lazy(() => import('../pages/MapPage/MapPage.tsx'));
const RoadmapPage = lazy(() => import('../pages/RoadmapPage/RoadmapPage.tsx'));
const RoutesPage = lazy(() => import('../pages/RoutesPage/RoutesPage.tsx'));
const RouteDetailPage = lazy(() => import('../pages/RouteDetailPage/RouteDetailPage.tsx'));
const SearchPage = lazy(() => import('../pages/SearchPage/SearchPage.tsx'));
const GlossaryPage = lazy(() => import('../pages/GlossaryPage/GlossaryPage.tsx'));
const NotationPage = lazy(() => import('../pages/NotationPage/NotationPage.tsx'));
const ProgressPage = lazy(() => import('../pages/ProgressPage/ProgressPage.tsx'));
const AboutPage = lazy(() => import('../pages/AboutPage/AboutPage.tsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage.tsx'));

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
      { path: '*', Component: NotFoundPage },
    ],
  },
];
