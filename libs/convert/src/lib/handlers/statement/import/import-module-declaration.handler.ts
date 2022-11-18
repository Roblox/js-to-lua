import { StringLiteral } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  capitalizeOnInvalidChars,
  getModulePath,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaVariableDeclaration,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export const createImportModuleDeclarationHandler = (
  importExpressionHandler: HandlerFunction<LuaExpression, StringLiteral>
) =>
  createHandlerFunction(
    (
      source,
      config: { isInitFile?: boolean },
      node: StringLiteral
    ): LuaVariableDeclaration => {
      const { path, isRelative } = getModulePath({
        isInitFile: !!config.isInitFile,
      })(node.value);
      const moduleQualifiedName = isRelative
        ? capitalizeOnInvalidChars(path[path.length - 1])
        : capitalizeOnInvalidChars(
            path.filter((p) => p !== 'Packages').join('-')
          );
      const moduleName = `${moduleQualifiedName}Module`;

      return variableDeclaration(
        [variableDeclaratorIdentifier(identifier(moduleName))],
        [variableDeclaratorValue(importExpressionHandler(source, config, node))]
      );
    }
  );
