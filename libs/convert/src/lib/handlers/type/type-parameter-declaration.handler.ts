import {
  FlowType,
  TSType,
  TSTypeParameterDeclaration,
  TypeParameterDeclaration,
} from '@babel/types';
import { combineHandlers, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultElementHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaType, LuaTypeParameterDeclaration } from '@js-to-lua/lua-types';
import { createFlowTypeParameterDeclarationHandler } from './flow/flow-type-parameter-declaration.handler';
import { createTsTypeParameterDeclarationHandler } from './ts/ts-type-parameter-declaration.handler';

export const createTypeParameterDeclarationHandler = (
  typesHandler: HandlerFunction<LuaType, FlowType | TSType>
) => {
  return combineHandlers<
    LuaTypeParameterDeclaration,
    TSTypeParameterDeclaration | TypeParameterDeclaration
  >(
    [
      createTsTypeParameterDeclarationHandler(typesHandler),
      createFlowTypeParameterDeclarationHandler(typesHandler),
    ],
    defaultElementHandler
  );
};
