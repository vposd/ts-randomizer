const path = require('path');
const { compile } = require('../build/debug/compile');

compile([
  path.join(__dirname, 'transformer.test.ts'),
  path.join(__dirname, 'fixture.test.ts'),
]);
