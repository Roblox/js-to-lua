import {
  Declaration,
  ExportNamedDeclaration,
  Expression,
  Identifier,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultStatementHandler,
  removeIdTypeAnnotation,
  unwrapNodeGroup,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  exportTypeStatement,
  identifier,
  indexExpression,
  isAnyNodeType,
  isIdentifier,
  isLuaDeclaration,
  isTypeAliasDeclaration,
  isVariableDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTypeAliasDeclaration,
  memberExpression,
  nodeGroup,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { uniqWith } from 'ramda';
import { createImportExpressionHandler } from '../import/import-expression.handler';
import { createImportModuleDeclarationHandler } from '../import/import-module-declaration.handler';
import { createExportSpecifierHandler } from './export-specifier.handler';
import { createExtractDeclarationMetadata } from './extract-declaration-metadata';

export const createExportNamedHandler = (
  handleDeclaration: HandlerFunction<
    LuaDeclaration | LuaNodeGroup,
    Declaration
  >,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  return createHandler(
    'ExportNamedDeclaration',
    (source, config, node: ExportNamedDeclaration) => {
      if (node.declaration) {
        const extractDeclarationMetadata =
          createExtractDeclarationMetadata(getDeclarationId);
        const { declarationIds, declarationNotIds, exportedTypes } =
          extractDeclarationMetadata(
            handleDeclaration(source, config, node.declaration)
          );

        return unwrapNodeGroup(
          nodeGroup([
            ...exportedTypes.map((t) => exportTypeStatement(t)),
            ...declarationNotIds,
            ...declarationIds.map((id) => {
              if (isTypeAliasDeclaration(id)) {
                return exportTypeStatement(id);
              }
              const idWithoutTypeAnnotation = isIdentifier(id)
                ? removeIdTypeAnnotation(id)
                : id;
              return assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  isIdentifier(idWithoutTypeAnnotation)
                    ? memberExpression(
                        identifier('exports'),
                        '.',
                        idWithoutTypeAnnotation
                      )
                    : indexExpression(
                        identifier('exports'),
                        idWithoutTypeAnnotation
                      ),
                ],
                [idWithoutTypeAnnotation]
              );
            }),
          ])
        );
      }

      if (node.specifiers) {
        let sourceDeclarations: LuaStatement[] = [];
        let moduleExpression: LuaExpression | null = null;
        if (node.source) {
          const importExpressionHandler = createImportExpressionHandler();
          const handleImportExpression = importExpressionHandler(
            source,
            config
          );
          const handleImportModuleDeclaration =
            createImportModuleDeclarationHandler(importExpressionHandler)(
              source,
              config
            );
          const needsSeparateModuleDeclaration =
            node.specifiers.length > 1 || node.exportKind === 'type';

          const moduleAssignmentStatement = needsSeparateModuleDeclaration
            ? handleImportModuleDeclaration(node.source)
            : handleImportExpression(node.source);

          moduleExpression = isVariableDeclaration(moduleAssignmentStatement)
            ? moduleAssignmentStatement.identifiers[0].value
            : moduleAssignmentStatement;

          sourceDeclarations = isVariableDeclaration(moduleAssignmentStatement)
            ? [moduleAssignmentStatement]
            : [];
        }

        const specifierHandler = createExportSpecifierHandler(
          handleExpression,
          handleIdentifier,
          moduleExpression
        ).handler;
        const handleSpecifier = specifierHandler(source, config);
        return nodeGroup([
          ...sourceDeclarations,
          ...node.specifiers.map(handleSpecifier),
        ]);
      }

      return defaultStatementHandler(source, config, node);
    }
  );
};

const getDeclarationId = (
  declaration: LuaDeclaration | LuaNodeGroup
): Array<LuaLVal | LuaTypeAliasDeclaration> => {
  switch (declaration.type) {
    case 'FunctionDeclaration':
      return [declaration.id];
    case 'LuaTypeAliasDeclaration':
      return [declaration];
    case 'VariableDeclaration':
      return declaration.identifiers.map(({ value }) => value);
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
