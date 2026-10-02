import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [] } },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ["**/test-results/**", "**/playwright-report/**", "**/e2e/**"],
    },
  },
});
