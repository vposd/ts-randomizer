const path = require('path');
const {compile} = require('../build/debug/compile.js');

compile([
  path.join(__dirname, 'transformer.test.ts'),
  path.join(__dirname, 'randomizer.test.ts'),
]);
