import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../../../types';
import {
  Expression,
  Identifier,
  ImportDeclaration,
  StringLiteral,
} from '@babel/types';
import {
  callExpression,
  identifier,
  isVariableDeclaration,
  LuaCallExpression,
  LuaExpression,
  LuaIdentifier,
  LuaVariableDeclaration,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withExtras,
} from '@js-to-lua/lua-types';
import { createImportSpecifierHandler } from './import-specifier.handler';
import { getModulePath } from '../../../utils/get-module-path';
import { memberExpressionFromPath } from '../../../utils/member-expression-from-path';

export const createImportDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) =>
  createHandler(
    'ImportDeclaration',
    (source, config, node: ImportDeclaration) => {
      const importExpressionHandler = createHandlerFunction(
        (
          source,
          config: { isInitFile?: boolean },
          node: StringLiteral
        ): LuaCallExpression => {
          const { isRelative, path } = getModulePath(
            { isInitFile: !!config.isInitFile },
            node.value
          );

          const requireExpression = callExpression(identifier('require'), [
            memberExpressionFromPath(path),
          ]);
          return isRelative
            ? requireExpression
            : withExtras({ needsPackages: true }, requireExpression);
        }
      )(source, config);

      const importHandler = createHandlerFunction(
        (
          source,
          config: { isInitFile?: boolean },
          node: StringLiteral
        ): LuaVariableDeclaration => {
          const { path } = getModulePath(
            { isInitFile: !!config.isInitFile },
            node.value
          );
          const moduleName = `${path[path.length - 1]}Module`;

          return variableDeclaration(
            [variableDeclaratorIdentifier(identifier(moduleName))],
            [variableDeclaratorValue(importExpressionHandler(node))]
          );
        }
      )(source, config);

      if (!node.specifiers.length) {
        return importExpressionHandler(node.source);
      }

      const needsSeparateModuleDeclaration =
        node.specifiers.length > 1 || node.importKind === 'type';

      const moduleAssignmentStatement = needsSeparateModuleDeclaration
        ? importHandler(node.source)
        : importExpressionHandler(node.source);

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
