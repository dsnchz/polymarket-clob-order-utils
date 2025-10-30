import { defineConfig } from "tsup";

import pkg from "./package.json";

export default defineConfig({
  name: "polymarket-clob-order-utils",
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  bundle: true,
  dts: {
    footer: `declare module '${pkg.name}'`,
  },
});
