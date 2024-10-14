// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/yk-color-picker.ts",
      name: "YKColorPicker",
      formats: ["es", "umd"],
      fileName: (format) => `yk-color-picker.${format}.js`,
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@yk-color-picker": path.resolve(__dirname, "./src/yk-color-picker"),
    },
  },
  server: {
    open: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: "dist",
      rollupTypes: true,
    }),
  ],
});
