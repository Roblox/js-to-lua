import { Declaration } from '@babel/types';
import { LuaDeclaration } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleVariableDeclaration } from './variable-declaration.handler';

export const handleDeclaration = combineHandlers<
  BaseNodeHandler<Declaration, LuaDeclaration>
>([handleVariableDeclaration]);
