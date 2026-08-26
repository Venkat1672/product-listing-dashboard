import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
    server: {
        allowedHosts: ["catch-regular-nil-receives.trycloudflare.com"],
          },
          });