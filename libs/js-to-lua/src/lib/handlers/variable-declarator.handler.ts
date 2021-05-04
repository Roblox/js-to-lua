import { VariableDeclarator } from '@babel/types';
import { LuaVariableDeclarator } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { handleExpression } from './expression-statement.handler';
import { lValHandler } from './l-val.handler';

export const handleVariableDeclarator: BaseNodeHandler<
  VariableDeclarator,
  LuaVariableDeclarator
> = {
  type: 'VariableDeclarator',
  handler: (node: VariableDeclarator) => {
    return {
      type: 'VariableDeclarator',
      id: lValHandler(node.id),
      init: node.init ? handleExpression.handler(node.init) : null,
    };
  },
};
