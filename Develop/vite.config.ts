import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './env',
  plugins: [react()],
});
