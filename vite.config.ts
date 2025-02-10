

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure output goes to the 'dist' folder
    chunkSizeWarningLimit: 2000, // Set chunk size limit to 2MB
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for cleaner imports
    },
  },
});
