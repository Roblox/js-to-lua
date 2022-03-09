import { TSTypeParameterDeclaration } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import {
  LuaTypeParameterDeclaration,
  typeParameterDeclaration,
} from '@js-to-lua/lua-types';
import { createTsTypeParameterHandler } from '../type/ts-type-parameter.handler';

export const createTsTypeParameterDeclarationHandler = () => {
  const handleTsTypeParameterDeclaration: BaseNodeHandler<
    LuaTypeParameterDeclaration,
    TSTypeParameterDeclaration
  > = createHandler('TSTypeParameterDeclaration', (source, config, node) => {
    const handleTsTypeParameter = createTsTypeParameterHandler().handler(
      source,
      config
    );
    return typeParameterDeclaration(node.params.map(handleTsTypeParameter));
  });

  return handleTsTypeParameterDeclaration;
};
