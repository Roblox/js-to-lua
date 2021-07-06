import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '../../../types';
import { ExportDefaultDeclaration, Expression } from '@babel/types';
import {
  assignmentStatement,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableConstructor,
  memberExpression,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../../utils/default-handlers';
import { combineHandlers } from '../../../utils/combine-handlers';
import { equals } from 'ramda';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createExportDefaultHandler = (
  handleDeclaration: HandlerFunction<
    LuaDeclaration,
    Exclude<ExportDefaultDeclaration['declaration'], Expression>
  >,
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler(
    'ExportDefaultDeclaration',
    (source, node: ExportDefaultDeclaration) => {
      const { handler } = combineHandlers<
        LuaStatement,
        BaseNodeHandler<
          LuaDeclaration | LuaExpression,
          ExportDefaultDeclaration['declaration']
        >
      >(
        [
          createHandler(
            ['ClassDeclaration', 'FunctionDeclaration', 'TSDeclareFunction'],
            (
              source,
              node: Exclude<ExportDefaultDeclaration['declaration'], Expression>
            ) => handleDeclaration(source, node)
          ),
          createHandler(
            ['ObjectExpression', 'Identifier'],
            (source, node: Expression) => handleExpression(source, node)
          ),
          { type: [], handler: handleExpression },
        ],
        defaultStatementHandler
      );

      if (node.declaration) {
        const declaration = handler(source, node.declaration);
        const declarationIds = getDeclarationId(declaration);

        return declarationIds.every(equals(declaration))
          ? assignmentStatement(
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              declarationIds
            )
          : nodeGroup([
              declaration,
              assignmentStatement(
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('default')
                  ),
                ],
                declarationIds
              ),
            ]);
      }

      return defaultStatementHandler(source, node);
    }
  );

const getDeclarationId = (
  declaration: LuaExpression | LuaDeclaration
): NonEmptyArray<LuaLVal | LuaTableConstructor | LuaExpression> => {
  switch (declaration.type) {
    case 'FunctionDeclaration':
    case 'LuaTypeAliasDeclaration':
      return [declaration.id];
    case 'VariableDeclaration':
      return declaration.identifiers.map(
        ({ value }) => value
      ) as NonEmptyArray<LuaLVal>;
    case 'TableConstructor':
    case 'Identifier':
      return [declaration];
    default:
      return [declaration];
  }
};
export const foo = 'bar';
