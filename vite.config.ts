import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Spark Dating',
          short_name: 'Spark',
          theme_color: '#f43f5e',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
        '/socket.io': {
          target: process.env.VITE_SOCKET_URL || 'http://127.0.0.1:3000',
          ws: true,
          changeOrigin: true,
        }
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
