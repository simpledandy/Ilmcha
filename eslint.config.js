const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const typescript = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

// Workaround for bug in `globals` package
const { "AudioWorkletGlobalScope ": _, ...safeBrowserGlobals } =
  globals.browser;

/**
 * Flat config array
 * See: https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
module.exports = [
  {
    // Global ignores
    ignores: [
      "node_modules/",
      "coverage/",
      ".expo/",
      ".git/",
      "dist/",
      "app.json",
      "eas.json",
      "metro.config.js",
      "babel.config.js",
      "jest.config.js",
      "jest.setup.js",
    ],
  },
  // Base config for all linted files
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Config for TypeScript files in `src`
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescript,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        ...safeBrowserGlobals,
        ...globals.es2021,
        __DEV__: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...typescript.configs["recommended-requiring-type-checking"].rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // Config for JS config files
  {
    files: ["eslint.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off",
    },
  },

  // Config for test files
  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
];
