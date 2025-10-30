import { defineConfig } from "tsup";

import pkg from "./package.json";

export default defineConfig({
  name: "polymarket-clob-order-utils",
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  bundle: false,
  external: [...Object.keys(pkg.dependencies)],
  dts: {
    footer: `declare module '${pkg.name}'`,
  },
});
