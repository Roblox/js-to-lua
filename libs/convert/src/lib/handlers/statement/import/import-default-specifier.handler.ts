import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { Identifier, ImportDefaultSpecifier } from '@babel/types';
import {
  identifier,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
  typeAliasDeclaration,
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
    (
      source,
      config: { isTypeImport?: boolean },
      node: ImportDefaultSpecifier
    ) => {
      return config.isTypeImport
        ? typeAliasDeclaration(
            handleIdentifier(source, config, node.local),
            memberExpression(moduleIdentifier, '.', identifier('default'))
          )
        : variableDeclaration(
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
          );
    }
  );
