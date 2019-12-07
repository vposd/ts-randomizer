module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex:
    '(build/manual-compile/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['build/tests'],
};
