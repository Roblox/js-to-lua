import {
  FlowType,
  Identifier,
  TSType,
  TSTypeAliasDeclaration,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
  LuaTypeAliasDeclaration,
  typeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { createTsTypeParameterDeclarationHandler } from '../type/ts-type-parameter-declaration.handler';

export const createTypeAliasDeclarationHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTypes: HandlerFunction<LuaType, TSType | FlowType>
): BaseNodeHandler<LuaTypeAliasDeclaration, TSTypeAliasDeclaration> =>
  createHandler('TSTypeAliasDeclaration', (source, config, node) => {
    const handleTsTypeParameterDeclaration =
      createTsTypeParameterDeclarationHandler(handleTypes).handler(
        source,
        config
      );

    return typeAliasDeclaration(
      handleIdentifier(source, config, node.id) as LuaIdentifier,
      handleTypes(source, config, node.typeAnnotation),
      node.typeParameters && node.typeParameters.params.length
        ? handleTsTypeParameterDeclaration(node.typeParameters)
        : undefined
    );
  });
