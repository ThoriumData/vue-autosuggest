module.exports = {
  env: {
    browser: true
  },
  extends: ["plugin:vue/recommended"],
  plugins: ["vue"],
  rules: {
    "vue/valid-v-if": "error",
    "no-console": "off",
    "no-debugger": "off",
    "vue/html-end-tags": "error",
    "vue/no-unused-vars": "warn",
  }
};