module.exports = {
  extends: ['./node_modules/gts'],
  ignorePatterns: [
    'build/**/*',
    'examples/**/*',
    'debug/**/*',
    '.prettierrc.js',
    '**/*.d.ts',
    '**/*.js',
    '**/*.js.map',
    'coverage/**/*',
    'node_modules/**/*',
  ],
  rules: {
    'n/no-deprecated-api': 'off',
    'n/no-extraneous-require': 'off',
  },
};
