import * as ts from 'typescript';

import { DescriptionFactory, generateNodeDescription } from './node';
import { DescriptionFlag } from '../../types';

export const getTupleNodeDescription: DescriptionFactory<ts.TupleTypeNode> = (
  typeNode,
  typeArgumentsMap = {}
) => ({
  flag: DescriptionFlag.Tuple,
  description: typeNode.elements.map(i => ({
    description: generateNodeDescription(i, typeArgumentsMap),
  })),
});
