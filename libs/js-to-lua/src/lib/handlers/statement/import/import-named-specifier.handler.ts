import { createHandler, HandlerFunction } from '../../../types';
import { Expression, Identifier, ImportSpecifier } from '@babel/types';
import {
  LuaExpression,
  LuaIdentifier,
  memberExpression,
  typeAliasDeclaration,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export const createImportNamedSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression
) =>
  createHandler(
    'ImportSpecifier',
    (source, config: { isTypeImport?: boolean }, node: ImportSpecifier) =>
      config.isTypeImport
        ? typeAliasDeclaration(
            handleIdentifier(source, config, node.local),
            memberExpression(
              moduleIdentifier,
              '.',
              handleExpression(source, config, node.imported)
            )
          )
        : variableDeclaration(
            [
              variableDeclaratorIdentifier(
                handleIdentifier(source, config, node.local)
              ),
            ],
            [
              variableDeclaratorValue(
                memberExpression(
                  moduleIdentifier,
                  '.',
                  handleExpression(source, config, node.imported)
                )
              ),
            ]
          )
  );
