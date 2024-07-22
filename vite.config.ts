import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "viewer", // Specify your library name here
      // Optionally, you can also specify the formats you want to build for:
      formats: ["umd", "es"],
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src/"),
    },
  },
});
