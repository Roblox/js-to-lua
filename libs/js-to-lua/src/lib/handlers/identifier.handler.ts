import { BaseNodeHandler } from '../types';
import { Identifier } from '@babel/types';
import { LuaNilLiteral } from '../lua-nodes.types';

export const handleIdentifier: BaseNodeHandler<Identifier, LuaNilLiteral> = {
  type: 'Identifier',
  handler: (node) => {
    switch (node.name) {
      case 'undefined':
        return {
          type: 'NilLiteral',
        };
    }
  },
};
