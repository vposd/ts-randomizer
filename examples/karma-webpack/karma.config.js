const {transformer} = require('ts-randomizer/transformer');

module.exports = function (config) {
  const _config = {
    basePath: '',
    frameworks: ['jasmine'],
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            options: {
              getCustomTransformers: program => ({
                before: [transformer(program)],
              }),
            },
          },
        ],
      },
    },
    files: [
      {
        pattern: 'test/test.spec.ts',
        watched: false,
      },
    ],
    preprocessors: {
      'test/test.spec.ts': ['webpack'],
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
  };

  config.set(_config);
};
