import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "playwright-report/**", "test-results/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-void": ["error", { allowAsStatement: true }],
    },
  },
  {
    files: ["*.{js,ts}", "scripts/**/*.mjs", "tests/**/*.ts"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
]);
