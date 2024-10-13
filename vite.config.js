// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/yk-color-picker.js",
      name: "YKColorPicker",
      formats: ["es", "umd"],
      fileName: (format) => `yk-color-picker.${format}.js`,
    },
  },
  resolve: {
    alias: {
      "@yk-color-picker": path.resolve(__dirname, "./src/yk-color-picker"),
    },
  },
  server: {
    open: true,
  },
});
