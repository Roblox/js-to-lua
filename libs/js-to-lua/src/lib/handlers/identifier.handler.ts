import { Identifier } from '@babel/types';
import { LuaIdentifier, LuaNilLiteral } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';

export const handleIdentifier: BaseNodeHandler<
  Identifier,
  LuaNilLiteral | LuaIdentifier
> = {
  type: 'Identifier',
  handler: (node) => {
    switch (node.name) {
      case 'undefined':
        return {
          type: 'NilLiteral',
        };
      default:
        return {
          type: 'Identifier',
          name: node.name,
        };
    }
  },
};
