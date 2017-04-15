module.exports = {
  extends: "eslint-config-standard",
  parserOptions: {
    "ecmaVersion": 8
  },
  rules: {
    "space-before-function-paren": ["error", "never"],
    "prefer-const": "warn",
    "comma-dangle": ["error", "only-multiline"],
    "space-infix-ops": "off",      // Until eslint #7489 lands
    "new-cap": "off",
    "no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],    
    "one-var": "off",
    "new-parens": "off",
    "arrow-body-style": ["warn", "as-needed"],

    // This rule enforces a comma-first style, such as
    // npm uses. It can look a bit weird, so we're leaving them
    // out for now.
    "comma-style": ["error", "first", {
      exceptions: {
        ArrayExpression: true,
        ObjectExpression: true,
      }
    }],
  },
}