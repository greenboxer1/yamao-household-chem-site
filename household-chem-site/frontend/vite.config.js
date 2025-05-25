import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: '/', // Ensure base is set to root
    server: {
      port: 5173,
      proxy: {
        '^/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        },
        '^/images': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
});