import { TSType, TSTypeParameterDeclaration } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaType,
  LuaTypeParameterDeclaration,
  typeParameterDeclaration,
} from '@js-to-lua/lua-types';
import { createTsTypeParameterHandler } from '../type/ts-type-parameter.handler';

export const createTsTypeParameterDeclarationHandler = (
  typesHandler: HandlerFunction<LuaType, TSType>
) => {
  const handleTsTypeParameterDeclaration: BaseNodeHandler<
    LuaTypeParameterDeclaration,
    TSTypeParameterDeclaration
  > = createHandler('TSTypeParameterDeclaration', (source, config, node) => {
    const handleTsTypeParameter = createTsTypeParameterHandler(
      typesHandler
    ).handler(source, config);
    return typeParameterDeclaration(node.params.map(handleTsTypeParameter));
  });

  return handleTsTypeParameterDeclaration;
};
