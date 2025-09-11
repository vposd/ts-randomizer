module.exports = {
  extends: ['./node_modules/gts/'],
  ignorePatterns: [
    'build/**/*',
    'examples/**/*',
    'debug/**/*',
    '.prettierrc.js',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      env: {
        jest: true,
      },
      rules: {
        'n/no-deprecated-api': 'off',
      },
    },
  ],
};
