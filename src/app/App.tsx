import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes.tsx';

// Vite's BASE_URL ends with a slash; the router expects the basename without it.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const router = createBrowserRouter(routes, { basename });

export function App() {
  return <RouterProvider router={router} />;
}
