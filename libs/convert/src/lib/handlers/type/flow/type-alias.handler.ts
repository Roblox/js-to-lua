import { FlowType, Identifier, TSType, TypeAlias } from '@babel/types';
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
import { createFlowTypeParameterDeclarationHandler } from './type-parameter-declaration.handler';

export const createFlowTypeAliasHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTypes: HandlerFunction<LuaType, TSType | FlowType>
): BaseNodeHandler<LuaTypeAliasDeclaration, TypeAlias> =>
  createHandler('TypeAlias', (source, config, node) => {
    const handleFlowTypeParameterDeclaration =
      createFlowTypeParameterDeclarationHandler(handleTypes).handler(
        source,
        config
      );

    return typeAliasDeclaration(
      handleIdentifier(source, config, node.id) as LuaIdentifier,
      handleTypes(source, config, node.right),
      node.typeParameters && node.typeParameters.params.length
        ? handleFlowTypeParameterDeclaration(node.typeParameters)
        : undefined
    );
  });
