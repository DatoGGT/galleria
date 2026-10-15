import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The Django API runs on :8000 in development.
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
});
