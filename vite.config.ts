import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/kishitu-gensen/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ja: resolve(__dirname, "ja/index.html"),
        en: resolve(__dirname, "en/index.html"),
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
