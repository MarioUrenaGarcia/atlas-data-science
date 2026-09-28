import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { contentPlugin } from './scripts/content/vite-plugin.ts';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), contentPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
