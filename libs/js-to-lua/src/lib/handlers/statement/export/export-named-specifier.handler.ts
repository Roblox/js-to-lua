import { createHandler, HandlerFunction } from '../../../types';
import { ExportSpecifier, Expression, Identifier } from '@babel/types';
import {
  assignmentStatement,
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
} from '@js-to-lua/lua-types';

export const createExportNamedSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression | null
) =>
  createHandler('ExportSpecifier', (source, config, node: ExportSpecifier) => {
    const localIdentifier = handleIdentifier(source, config, node.local);
    const exported = handleExpression(source, config, node.exported);
    return assignmentStatement(
      [
        isIdentifier(exported)
          ? memberExpression(identifier('exports'), '.', exported)
          : indexExpression(identifier('exports'), exported),
      ],
      [
        moduleIdentifier
          ? memberExpression(moduleIdentifier, '.', localIdentifier)
          : localIdentifier,
      ]
    );
  });
