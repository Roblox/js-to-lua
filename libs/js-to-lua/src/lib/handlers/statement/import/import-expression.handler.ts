import { StringLiteral } from '@babel/types';
import { withExtras } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
} from '@js-to-lua/lua-types';
import { createHandlerFunction } from '../../../types';
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
