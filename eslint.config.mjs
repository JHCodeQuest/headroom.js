import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "node_modules/**", "examples/typescript/main.js", "cypress/screenshots/**", "cypress/videos/**"] },
  js.configs.recommended,
  {
    files: ["src/Headroom.js", "src/features.js", "src/scroller.js", "src/trackScroll.js", "cypress/**/*.js", "*.{js,mjs}", "scripts/*.mjs", "test/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.browser, ...globals.node, ...globals.mocha, cy: "readonly", Cypress: "readonly", chai: "readonly", expect: "readonly" }
    },
    rules: {
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^_" }],
      "no-unused-expressions": "error", "no-bitwise": "error", camelcase: "error",
      curly: "error", eqeqeq: "error", "wrap-iife": ["error", "any"],
      "no-use-before-define": ["error", { functions: false }],
      "new-cap": "error", "no-caller": "error", quotes: ["error", "double"]
    }
  },
  { files: ["src/angular.headroom.js", "src/jQuery.headroom.js"], languageOptions: { globals: { ...globals.browser, Headroom: "readonly" } } }
];
