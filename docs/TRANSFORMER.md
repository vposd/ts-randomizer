# Transformer

## How to use the custom transformer
Unfortunately, TypeScript itself does not currently provide any easy way to use custom transformers (See https://github.com/Microsoft/TypeScript/issues/14419).
The followings are the example usage of the custom transformer.

### webpack (with ts-loader or awesome-typescript-loader)
[Check an example with karma-webpack and ts-patch](https://github.com/vposd/ts-randomizer/examples/karma-webpack)
```js
// webpack.config.js
const transformer = require('ts-randomizer').transformer;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader', // or 'awesome-typescript-loader'
        options: {
          getCustomTransformers: program => ({
            before: [
              transformer(program)
            ],
          }),
        },
    }],
  },
};
```

### ts-patch
See [ts-patch's README](https://github.com/nonara/ts-patch/blob/master/README.md), and [check an example](https://github.com/vposd/ts-randomizer/examples/karma-webpack)
```
npm i -g ts-patch
ts-patch install
```
```json
// tsconfig.json
{
  "compilerOptions": {
    ...,
    "plugins": [
      { "transform": "ts-randomizer", "import": "transformer" }
    ]
  },
  ...
}
```

### ttypescript
[Check an example with jest and ttypescript compiler](https://github.com/vposd/ts-randomizer/examples/jest)
See [ttypescript's README](https://github.com/cevek/ttypescript/blob/master/README.md) for how to use this with module bundlers such as webpack or Rollup.
```json
// tsconfig.json
{
  "compilerOptions": {
    ...,
    "plugins": [
      { "transform": "ts-randomizer", "import": "transformer" }
    ]
  },
  ...
}
```

### TypeScript API
See [debug folder](https://github.com/vposd/ts-randomizer/debug) for more details. Also, you can try it with ```$ npm run test```
```typescript
import * as ts from 'typescript';
import { transformer } from 'ts-randomizer';

const program = ts.createProgram([/* your files to compile */], {
  strict: true,
  noEmitOnError: true,
  target: ts.ScriptTarget.ES5
});

const transformers = {
  before: [transformer(program)],
  after: []
};
const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, transformers);

if (emitSkipped) {
  throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
}
```
