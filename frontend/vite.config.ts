import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    allowedHosts: ["calsol.onrender.com"],
  },
  preview: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    allowedHosts: ["calsol.onrender.com"],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/",
});
