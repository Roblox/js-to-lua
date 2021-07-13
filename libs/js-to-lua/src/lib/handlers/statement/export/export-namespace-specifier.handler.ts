import { createHandler, HandlerFunction } from '../../../types';
import { ExportNamespaceSpecifier, Expression, Identifier } from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../../utils/default-handlers';

export const createExportNamespaceSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression | null
) =>
  createHandler(
    'ExportNamespaceSpecifier',
    (source, config, node: ExportNamespaceSpecifier) => {
      if (!moduleIdentifier) {
        return defaultStatementHandler(source, config, node);
      }
      const exported = handleExpression(source, config, node.exported);
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          isIdentifier(exported)
            ? memberExpression(identifier('exports'), '.', exported)
            : indexExpression(identifier('exports'), exported),
        ],
        [moduleIdentifier]
      );
    }
  );
