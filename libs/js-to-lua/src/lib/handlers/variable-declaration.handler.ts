import { VariableDeclaration } from '@babel/types';
import { LuaVariableDeclaration } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { handleVariableDeclarator } from './variable-declarator.handler';

export const handleVariableDeclaration: BaseNodeHandler<
  VariableDeclaration,
  LuaVariableDeclaration
> = {
  type: 'VariableDeclaration',
  handler: (declaration) => {
    return {
      type: 'VariableDeclaration',
      ...declaration.declarations.map(handleVariableDeclarator.handler).reduce(
        (obj, declarator) => {
          obj.identifiers.push({
            type: 'VariableDeclaratorIdentifier',
            value: declarator.id,
          });
          obj.values.push({
            type: 'VariableDeclaratorValue',
            value: declarator.init,
          });
          return obj;
        },
        { identifiers: [], values: [] }
      ),
    };
  },
};
