import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In development, /api/public goes to the POS server, the same way the host's rewrite does in production.
// Set POS_DEV_URL to use a local POS instead (e.g. http://localhost:5000).
const posServer = process.env.POS_DEV_URL || "https://ms-home-security-pos.onrender.com";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api/public": { target: posServer, changeOrigin: true } } },
  preview: { proxy: { "/api/public": { target: posServer, changeOrigin: true } } },
});
