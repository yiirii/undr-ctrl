import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { hoverOnly } from './src/ui/hoverOnly';
export default defineConfig({ plugins: [react()], css: { postcss: { plugins: [hoverOnly()] } }, base: './', server: { port: 5173 }, build: { outDir: 'dist', emptyOutDir: true } });
