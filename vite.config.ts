import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define and export Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensures the output goes to 'dist' folder
    chunkSizeWarningLimit: 2000, // Set chunk size limit to 2MB
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for cleaner imports
    },
  },
});
