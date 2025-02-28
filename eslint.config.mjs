import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    plugins: ["simple-import-sort"],
    rules: {
      "simple-import-sort/imports": [
        "error",
        { groups: [["^\\u0000", "^\\w", "^[^@.]"], ["^@"]] },
      ],
      "simple-import-sort/exports": "error",
      "import/no-duplicates": "error",
    },
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
  }),
];

export default eslintConfig;
