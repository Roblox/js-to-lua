import { StringLiteral } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getModulePath,
  removeInvalidChars,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaVariableDeclaration,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { capitalize, decapitalize } from '@js-to-lua/shared-utils';

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
        ? path[path.length - 1]
        : decapitalize(
            removeInvalidChars(
              path
                .filter((p) => p !== 'Packages')
                .map((p) => capitalize(p))
                .join('')
            )
          );
      const moduleName = `${moduleQualifiedName}Module`;

      return variableDeclaration(
        [variableDeclaratorIdentifier(identifier(moduleName))],
        [variableDeclaratorValue(importExpressionHandler(source, config, node))]
      );
    }
  );
