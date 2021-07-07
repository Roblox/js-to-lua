import { createHandler, HandlerFunction } from '../../../types';
import {
  ExportDefaultDeclaration,
  Expression,
  FunctionDeclaration,
} from '@babel/types';
import {
  assignmentStatement,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
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
    (source, config, node: ExportDefaultDeclaration) => {
      const { handler } = combineHandlers<
        LuaDeclaration | LuaExpression,
        ExportDefaultDeclaration['declaration']
      >(
        [
          createHandler(
            ['ClassDeclaration', 'TSDeclareFunction'],
            (
              source,
              config,
              node: Exclude<ExportDefaultDeclaration['declaration'], Expression>
            ) => handleDeclaration(source, config, node)
          ),
          createHandler(
            'FunctionDeclaration',
            (source, config, node: FunctionDeclaration) =>
              node.id
                ? handleDeclaration(source, config, node)
                : handleExpression(source, config, {
                    ...node,
                    type: 'FunctionExpression',
                  })
          ),
          createHandler(
            ['ObjectExpression', 'Identifier'],
            (source, config, node: Expression) =>
              handleExpression(source, config, node)
          ),
          { type: [], handler: handleExpression },
        ],
        defaultStatementHandler
      );

      if (node.declaration) {
        const declaration = handler(source, config, node.declaration);
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

      return defaultStatementHandler(source, config, node);
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
