import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { Identifier, ImportDefaultSpecifier } from '@babel/types';
import {
  identifier,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export const createImportDefaultSpecifierHandler = (
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression
) =>
  createHandler(
    'ImportDefaultSpecifier',
    (source, config, node: ImportDefaultSpecifier) =>
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            handleIdentifier(source, config, node.local)
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(moduleIdentifier, '.', identifier('default'))
          ),
        ]
      )
  );
