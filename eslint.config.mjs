import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginTailwindcss.configs["flat/recommended"] ??
    eslintPluginTailwindcss.configs.recommended,
  {
    plugins: {
      tailwindcss: eslintPluginTailwindcss,
    },
    settings: {
      tailwindcss: {
        // D5: single source of truth for design tokens.
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      // D5: no component may reference a raw pixel/color/radius value —
      // enforced here, not just by convention.
      "tailwindcss/no-arbitrary-value": "error",
      // Hand-written utility classes in globals.css that intentionally
      // can't be expressed as Tailwind classes without arbitrary-value
      // syntax (calc()-based insets, scrollbar hiding) — see their doc
      // comments there for why each one exists.
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["carousel-inset", "scrollbar-hide", "logo-marquee-track"] },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
