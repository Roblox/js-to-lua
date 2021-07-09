import { createHandler, HandlerFunction } from '../../../types';
import {
  Declaration,
  ExportNamedDeclaration,
  Expression,
  Identifier,
} from '@babel/types';
import {
  assignmentStatement,
  exportTypeStatement,
  identifier,
  indexExpression,
  isIdentifier,
  isVariableDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNode,
  LuaTypeAliasDeclaration,
  memberExpression,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../../utils/default-handlers';
import { createImportExpressionHandler } from '../import/import-expression.handler';
import { createImportModuleDeclarationHandler } from '../import/import-module-declaration.handler';
import { createExportSpecifierHandler } from './export-specifier.handler';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createExportNamedHandler = (
  handleDeclaration: HandlerFunction<LuaDeclaration, Declaration>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  return createHandler(
    'ExportNamedDeclaration',
    (source, config, node: ExportNamedDeclaration) => {
      if (node.declaration) {
        const declaration = handleDeclaration(source, config, node.declaration);
        const declarationIds = getDeclarationId(declaration);

        if (node.exportKind === 'type') {
          return exportTypeStatement(declaration as LuaTypeAliasDeclaration);
        }

        return nodeGroup([
          declaration,
          assignmentStatement(
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
        let sourceDeclarations: LuaNode[] = [];
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
    default:
      return [declaration];
  }
};
export const foo = 'bar';
