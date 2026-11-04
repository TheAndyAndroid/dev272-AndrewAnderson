// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPlugInPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  globalIgnores(["dist/*", "coverage/*", ".expo/*"]),
  expoConfig,
  eslintPlugInPrettierRecommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "warn", // flag leftover console.log
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react-hooks/exhaustive-deps": "error", // missing useEffort deps is a bug
    },
  },
]);
