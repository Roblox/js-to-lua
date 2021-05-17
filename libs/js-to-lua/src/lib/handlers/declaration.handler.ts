import { Declaration } from '@babel/types';
import { LuaDeclaration } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { handleFunctionDeclaration } from './function-declaration.handler';
import { handleVariableDeclaration } from './variable-declaration.handler';
import { combineHandlers } from '../utils/combine-handlers';
import { handleTypeAliasDeclaration } from './type-alias-declaration.handler';

export const handleDeclaration = combineHandlers<
  BaseNodeHandler<Declaration, LuaDeclaration>
>([
  handleVariableDeclaration,
  handleFunctionDeclaration,
  handleTypeAliasDeclaration,
]);
