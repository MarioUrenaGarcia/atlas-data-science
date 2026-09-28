import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// GitHub Pages serves 404.html for unknown paths; copying the SPA entry point
// lets deep links resolve through the client-side router.
const distDir = 'dist';
const source = join(distDir, 'index.html');

if (!existsSync(source)) {
  console.error('No existe dist/index.html; ejecute primero vite build.');
  process.exit(1);
}

copyFileSync(source, join(distDir, '404.html'));
console.log('dist/404.html creado.');
