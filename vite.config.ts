import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const OUTPUT_DIR = 'release/app/dist';
const root = process.cwd();
export default defineConfig({
  root,
  server: {
    host: true,
    port: 8080,
  },
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: OUTPUT_DIR,
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    manifest: true,
    emptyOutDir: false,
    rollupOptions: {
      input: './src/renderer/index.tsx',
    },
  },
  publicDir: 'assets',
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: ` @import '/@/assets/scss/variables'; `,
  //     },
  //   },
  // },
});
