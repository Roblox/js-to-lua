import {
  Declaration,
  ExportNamedDeclaration,
  Expression,
  Identifier,
} from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  exportTypeStatement,
  identifier,
  indexExpression,
  isIdentifier,
  isNodeGroup,
  isVariableDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTypeAliasDeclaration,
  LuaVariableDeclaration,
  memberExpression,
  nodeGroup,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { createHandler, HandlerFunction } from '../../../types';
import { defaultStatementHandler } from '../../../utils/default-handlers';
import { hasSourceTypeExtra } from '../../../utils/with-source-type-extra';
import { createImportExpressionHandler } from '../import/import-expression.handler';
import { createImportModuleDeclarationHandler } from '../import/import-module-declaration.handler';
import { createExportSpecifierHandler } from './export-specifier.handler';

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
        let declaration = handleDeclaration(source, config, node.declaration);
        let declarationIds;
        let exportedTypes: LuaTypeAliasDeclaration[] = [];

        const isClassDeclaration = (
          node: LuaDeclaration | LuaNodeGroup
        ): node is LuaNodeGroup =>
          isNodeGroup(node) && hasSourceTypeExtra('ClassDeclaration', node);

        if (isClassDeclaration(declaration)) {
          const [
            classType,
            classVariableDeclaration,
            ...rest
          ] = declaration.body;
          exportedTypes = [classType as LuaTypeAliasDeclaration];
          declaration = {
            ...declaration,
            body: [classVariableDeclaration, ...rest],
          };
          declarationIds = getDeclarationId(
            classVariableDeclaration as LuaVariableDeclaration
          );
        } else {
          declarationIds = getDeclarationId(declaration);
        }

        if (node.exportKind === 'type') {
          return exportTypeStatement(declaration as LuaTypeAliasDeclaration);
        }

        return nodeGroup([
          ...exportedTypes.map((t) => exportTypeStatement(t)),
          declaration,
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            declarationIds.map((id) =>
              isIdentifier(id)
                ? memberExpression(identifier('exports'), '.', id)
                : indexExpression(identifier('exports'), id)
            ),
            declarationIds
          ),
        ]);
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
          const handleImportModuleDeclaration = createImportModuleDeclarationHandler(
            importExpressionHandler
          )(source, config);
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
  declaration: LuaDeclaration
): NonEmptyArray<LuaLVal> => {
  switch (declaration.type) {
    case 'FunctionDeclaration':
    case 'LuaTypeAliasDeclaration':
      return [declaration.id];
    case 'VariableDeclaration':
      return declaration.identifiers.map(
        ({ value }) => value
      ) as NonEmptyArray<LuaLVal>;
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
export const foo = 'bar';
