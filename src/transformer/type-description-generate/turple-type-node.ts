import * as ts from 'typescript';

import {DescriptionFactory, generateNodeDescription} from './node';
import {DescriptionFlag} from '../../types';

export const getTurpleNodeDescription: DescriptionFactory<ts.TupleTypeNode> = (
  typeNode,
  typeArgumentsMap = {}
) => ({
  flag: DescriptionFlag.Turple,
  description: typeNode.elementTypes.map(i => ({
    description: generateNodeDescription(i, typeArgumentsMap),
  })),
});
