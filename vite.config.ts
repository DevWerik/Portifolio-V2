import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: "animation-vendor",
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              priority: 20,
            },
            {
              name: "form-vendor",
              test: /[\\/]node_modules[\\/](?:@hookform|react-hook-form|zod)[\\/]/,
              priority: 20,
            },
            {
              name: "ui-vendor",
              test: /[\\/]node_modules[\\/](?:@base-ui|lucide-react|react-icons)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  server: {
    watch: {
      // Avoid transient EBUSY errors from Windows' native file watcher.
      usePolling: process.platform === "win32",
      interval: 250,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
