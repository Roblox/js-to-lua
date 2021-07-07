import { createHandlerFunction, HandlerFunction } from '../../../types';
import { StringLiteral } from '@babel/types';
import {
  identifier,
  LuaExpression,
  LuaVariableDeclaration,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getModulePath } from '../../../utils/get-module-path';

export const createImportModuleDeclarationHandler = (
  importExpressionHandler: HandlerFunction<LuaExpression, StringLiteral>
) =>
  createHandlerFunction(
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
        [variableDeclaratorValue(importExpressionHandler(source, config, node))]
      );
    }
  );
