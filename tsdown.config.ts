import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "node18",
  platform: "node",
  dts: true,
  clean: true,
  sourcemap: true,
  fixedExtension: false,
  deps: {
    neverBundle: ["prettier"],
  },
});
