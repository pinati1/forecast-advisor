// 1. Change 'vite' to 'vitest/config' right here:
import { defineConfig } from "vitest/config"; 
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
  server: {
    port: 5173,
    host: "0.0.0.0"
  }
});