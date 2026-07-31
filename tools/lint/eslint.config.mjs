// Isolated ESLint flat config for the pinned lint toolchain (tools/lint).
//
// This is a mirror of the project's root eslint.config.js. It lives here so its
// ESM imports resolve from tools/lint/node_modules, where TypeScript is pinned
// to <6.1 (a version typescript-eslint officially supports). The project itself
// builds on TypeScript 7, which typescript-eslint cannot parse yet — running the
// lint step from this isolated toolchain keeps ESLint working without downgrading
// the project's build TypeScript.
//
// Keep this file in sync with ../../eslint.config.js.
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "src/**",
    "src/public/mockServiceWorker.js",
    "template-docs/**",
    "tools/**",
    "node_modules/**",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
