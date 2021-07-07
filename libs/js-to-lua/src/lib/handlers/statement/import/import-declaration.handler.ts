import { createHandler, HandlerFunction } from '../../../types';
import { Expression, Identifier, ImportDeclaration } from '@babel/types';
import {
  isVariableDeclaration,
  LuaExpression,
  LuaIdentifier,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { createImportSpecifierHandler } from './import-specifier.handler';
import { createImportExpressionHandler } from './import-expression.handler';
import { createImportModuleDeclarationHandler } from './import-module-declaration.handler';

export const createImportDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) =>
  createHandler(
    'ImportDeclaration',
    (source, config, node: ImportDeclaration) => {
      const importExpressionHandler = createImportExpressionHandler();
      const handleImportExpression = importExpressionHandler(source, config);

      const handleImportModuleDeclaration = createImportModuleDeclarationHandler(
        importExpressionHandler
      )(source, config);

      if (!node.specifiers.length) {
        return handleImportExpression(node.source);
      }

      const needsSeparateModuleDeclaration =
        node.specifiers.length > 1 || node.importKind === 'type';

      const moduleAssignmentStatement = needsSeparateModuleDeclaration
        ? handleImportModuleDeclaration(node.source)
        : handleImportExpression(node.source);

      const moduleExpression = isVariableDeclaration(moduleAssignmentStatement)
        ? moduleAssignmentStatement.identifiers[0].value
        : moduleAssignmentStatement;
      const handleSpecifier = createImportSpecifierHandler(
        handleExpression,
        handleIdentifier,
        moduleExpression
      ).handler(source, {
        ...config,
        isTypeImport: node.importKind === 'type',
      });

      const importStatements = node.specifiers.map(handleSpecifier);

      return needsSeparateModuleDeclaration
        ? nodeGroup([moduleAssignmentStatement, ...importStatements])
        : importStatements[0];
    }
  );
