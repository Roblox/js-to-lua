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
      ...declaration.declarations
        .map(handleVariableDeclarator.handler)
        .reduceRight(
          (obj, declarator) => {
            obj.identifiers.unshift({
              type: 'VariableDeclaratorIdentifier',
              value: declarator.id,
            });
            if (declarator.init !== null || obj.values.length > 0) {
              obj.values.unshift({
                type: 'VariableDeclaratorValue',
                value: declarator.init,
              });
            }
            return obj;
          },
          { identifiers: [], values: [] }
        ),
    };
  },
};
