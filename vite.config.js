import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.gastrocalc.com.ar',
      outDir: 'public',
      dynamicRoutes: [
        '/',
        '/calculadora-precio-delivery',
        '/calculadora-comision-delivery',
        '/simulador-delivery-vs-salon',
        '/calculadora-combos-gastronomicos',
      ],
    }),
  ],
});
