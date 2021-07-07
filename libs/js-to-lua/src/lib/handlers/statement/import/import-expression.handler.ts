import { createHandlerFunction } from '../../../types';
import { StringLiteral } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  withExtras,
} from '@js-to-lua/lua-types';
import { getModulePath } from '../../../utils/get-module-path';
import { memberExpressionFromPath } from '../../../utils/member-expression-from-path';

export const createImportExpressionHandler = () => {
  return createHandlerFunction(
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
  );
};
