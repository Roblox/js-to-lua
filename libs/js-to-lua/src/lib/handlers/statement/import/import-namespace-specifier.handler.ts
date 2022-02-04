import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { Identifier, ImportNamespaceSpecifier } from '@babel/types';
import {
  LuaExpression,
  LuaIdentifier,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export const createImportNamespaceSpecifierHandler = (
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression
) =>
  createHandler(
    'ImportNamespaceSpecifier',
    (source, config, node: ImportNamespaceSpecifier) => {
      return variableDeclaration(
        [
          variableDeclaratorIdentifier(
            handleIdentifier(source, config, node.local)
          ),
        ],
        [variableDeclaratorValue(moduleIdentifier)]
      );
    }
  );
