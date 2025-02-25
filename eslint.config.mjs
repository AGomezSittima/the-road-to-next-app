import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    plugins: ["simple-import-sort", "unused-imports"],
    rules: {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": [
        "error",
        { groups: [["^\\u0000", "^@?\\w", "^[^.]"]] },
      ],
      "simple-import-sort/exports": "error",
    },
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
  }),
];

export default eslintConfig;
