import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    allowedHosts: ["calsol.onrender.com"], // ✅ allow Render domain
  },
  preview: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    allowedHosts: ["calsol.onrender.com"], // ✅ same for preview builds
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/", // 👈 optional: ensures relative paths resolve correctly on Render
}));
