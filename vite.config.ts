import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { conceptFilesPlugin, contentPlugin } from './scripts/content/vite-plugin.ts';
import { cspPlugin } from './scripts/csp-plugin.ts';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), contentPlugin(), conceptFilesPlugin(), cspPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
    // Data files are fetched at runtime, and the CSP only allows fetching from
    // the site itself, so a JSON file must never be inlined as a data: URL.
    assetsInlineLimit: (file) => (file.endsWith('.json') ? false : undefined),
  },
});
