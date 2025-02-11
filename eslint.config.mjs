import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get the filename and directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat for compatibility with ESLint's old configuration format
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the ESLint configuration
const eslintConfig = [
  // Extend the recommended Next.js and TypeScript configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Additional ESLint configurations
  {
    // Specify environments
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    // Define parser options
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    // Import and configure additional plugins
    plugins: ["@typescript-eslint", "react"],
    // Specify custom rules
    rules: {
      "no-console": "warn",
      "react/react-in-jsx-scope": "off", // Next.js doesn't require React to be in scope
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;