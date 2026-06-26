import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "test-results/**",
      "playwright-report/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
