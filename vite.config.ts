import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define and export Vite configuration
const config: UserConfig = defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Set chunk size limit to 2MB
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for cleaner imports
    },
  },
});

export default config;
