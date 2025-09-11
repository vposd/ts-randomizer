import { TransformerFactory, SourceFile } from 'typescript';
import { AngularCompilerPlugin } from '@ngtools/webpack';

import { transformer } from 'ts-randomizer/transformer';

function findAngularCompilerPlugin(webpackCfg): AngularCompilerPlugin | null {
  return webpackCfg.plugins.find(
    plugin => plugin instanceof AngularCompilerPlugin
  );
}

// The AngularCompilerPlugin has nog public API to add transformations, user private API _transformers instead.
function addTransformerToAngularCompilerPlugin(
  acp: AngularCompilerPlugin,
  transformerFactory: TransformerFactory<SourceFile>
): void {
  acp['_transformers'] = [transformerFactory, ...acp['_transformers']];
}

export default {
  pre() {},

  // This hook is used to manipulate the webpack configuration
  config(cfg) {
    // Find the AngularCompilerPlugin in the webpack configuration
    const acp = findAngularCompilerPlugin(cfg);

    if (!acp) {
      throw new Error(
        'Could not inject the typescript transformer: Webpack AngularCompilerPlugin not found'
      );
    }

    addTransformerToAngularCompilerPlugin(
      acp,
      transformer({
        getTypeChecker() {
          return acp.typeChecker;
        },
      })
    );
    return cfg;
  },

  post() {},
};
