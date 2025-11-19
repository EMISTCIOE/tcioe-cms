import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [react(), jsconfigPaths()],
  base: '/',
  define: { global: 'window' },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: { open: true, port: 3003, allowedHosts: ['app.tcioe.edu.np'] },
  preview: { open: false, port: 4173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom'] } }
    },
    commonjsOptions: { include: [/node_modules/] }
  },
  esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [] }
}));
