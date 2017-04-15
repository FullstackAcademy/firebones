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
    // npm uses. I think it's great, but it can look a bit weird,
    // so we're leaving it off for now (although stock Bones passes
    // the linter with it on). If you decide you want to enforce
    // this rule, change "off" to "error".
    "comma-style": ["off", "first", {
      exceptions: {
        ArrayExpression: true,
        ObjectExpression: true,
      }
    }],
  },
}