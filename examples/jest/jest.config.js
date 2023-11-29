module.exports = {
  globals: {
    'ts-jest': {
      compiler: 'ts-patch/compiler',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
