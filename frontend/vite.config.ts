import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': {
        target: 'http://localhost:3302',
        changeOrigin: true,
        secure: false // dev mode
      }
    }
  }
});
