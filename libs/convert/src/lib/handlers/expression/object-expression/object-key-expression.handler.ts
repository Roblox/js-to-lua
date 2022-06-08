import {
  Expression,
  isStringLiteral as isBabelStringLiteral,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { callExpression, LuaExpression } from '@js-to-lua/lua-types';

export const createObjectKeyExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandlerFunction<LuaExpression, Expression>(
    (source, config, key: Expression) =>
      isBabelStringLiteral(key)
        ? handleExpression(source, config, key)
        : callExpression(
            {
              type: 'Identifier',
              name: 'tostring',
            },
            [handleExpression(source, config, key)]
          )
  );
};
