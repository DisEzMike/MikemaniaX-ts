import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    allowedHosts: true
  },
  preview: {
    port: 3000,
    allowedHosts: true
  },
   build: {
      chunkSizeWarningLimit: 1600
   }
});
