import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // next/image cannot optimise under `output: "export"`; screenshots are resized ahead of time by
    // scripts/convert-work-screenshots.mjs and rendered as plain <img> with explicit dimensions.
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored MapLibre worker, copied from node_modules on install.
    "public/maplibre/**",
  ]),
]);

export default eslintConfig;
