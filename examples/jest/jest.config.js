module.exports = {
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
