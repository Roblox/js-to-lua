import { ExportNamespaceSpecifier, Expression } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export const createExportNamespaceSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
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
