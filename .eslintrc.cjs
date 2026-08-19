module.exports = {
  root: true,
  extends: ["@rocketseat/eslint-config/react"],
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "no-void": ["error", { allowAsStatement: true }],
    "prettier/prettier": "off",
    semi: "off",
  },
};
