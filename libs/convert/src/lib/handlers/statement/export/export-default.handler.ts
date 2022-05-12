import {
  ClassDeclaration,
  ExportDefaultDeclaration,
  Expression,
  FunctionDeclaration,
  Identifier,
  isExpression as isBabelExpression,
  isIdentifier as isBabelIdentifier,
  isObjectExpression,
  ObjectExpression,
  TSDeclareFunction,
} from '@babel/types';
import {
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  createExpressionStatement,
  defaultStatementHandler,
  removeIdTypeAnnotation,
  unwrapNodeGroup,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  exportTypeStatement,
  identifier,
  isAnyNodeType,
  isExpression,
  isIdentifier,
  isLuaDeclaration,
  isTypeAliasDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaTableConstructor,
  memberExpression,
  nodeGroup,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { uniqWith } from 'ramda';
import { createExtractDeclarationMetadata } from './extract-declaration-metadata';

export const createExportDefaultHandler = (
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<ExportDefaultDeclaration['declaration'], Expression>
  >,
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler(
    'ExportDefaultDeclaration',
    (source, config, node: ExportDefaultDeclaration) => {
      const { handler } = combineHandlers<
        LuaNodeGroup | LuaDeclaration | LuaExpression,
        | ClassDeclaration
        | TSDeclareFunction
        | FunctionDeclaration
        | ObjectExpression
        | Identifier
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
            (source, config, node: ObjectExpression | Identifier) =>
              handleExpression(source, config, node)
          ),
        ],
        defaultStatementHandler
      );

      if (node.declaration) {
        if (
          isBabelExpression(node.declaration) &&
          !(
            isObjectExpression(node.declaration) ||
            isBabelIdentifier(node.declaration)
          )
        ) {
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [handleExpression(source, config, node.declaration)]
          );
        }
        const extractDeclarationMetadata =
          createExtractDeclarationMetadata(getDeclarationId);
        const { declarationIds, declarationNotIds, exportedTypes } =
          extractDeclarationMetadata(handler(source, config, node.declaration));

        return unwrapNodeGroup(
          nodeGroup([
            ...exportedTypes.map((t) => exportTypeStatement(t)),
            ...declarationNotIds.map((declarationNotId) =>
              isExpression(declarationNotId)
                ? createExpressionStatement(source, node, declarationNotId)
                : declarationNotId
            ),
            ...declarationIds.map((id) => {
              if (isTypeAliasDeclaration(id)) {
                return exportTypeStatement(id);
              }
              const idWithoutTypeAnnotation: typeof id = isIdentifier(id)
                ? removeIdTypeAnnotation(id)
                : id;
              return assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('default')
                  ),
                ],
                [idWithoutTypeAnnotation]
              );
            }),
          ])
        );
      }

      return defaultStatementHandler(source, config, node);
    }
  );

const getDeclarationId = (
  declaration: LuaExpression | LuaDeclaration | LuaNodeGroup
): Array<LuaLVal | LuaTableConstructor | LuaExpression> => {
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
    case 'NodeGroup': {
      const ids = declaration.body
        .filter(
          isAnyNodeType<LuaDeclaration | LuaNodeGroup>([
            isLuaDeclaration,
            isTypeAliasDeclaration,
          ])
        )
        .map((node) => getDeclarationId(node))
        .flat();

      return uniqWith(
        (a, b) => isIdentifier(a) && isIdentifier(b) && a.name === b.name,
        ids
      );
    }
    case 'UnhandledStatement':
      return [
        {
          ...declaration,
          ...unhandledExpression(),
        },
      ];
    default:
      return [declaration];
  }
};
