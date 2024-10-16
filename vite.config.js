// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";
import { cleandir } from "rollup-plugin-cleandir";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      plugins: [cleandir("./dist")],
      output: [
        {
          format: "es",
          dir: "dist/esm2020",
          entryFileNames: "yk-color-picker.js",
          preserveModules: false,
        },
        {
          format: "iife",
          dir: "dist/iife2020",
          entryFileNames: "yk-color-picker.js",
          name: "YK",
          strict: true,
        },
      ],
    },
  },
  resolve: {
    alias: {
      "yk-color-picker": path.resolve(__dirname, "./src/yk-color-picker"),
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
