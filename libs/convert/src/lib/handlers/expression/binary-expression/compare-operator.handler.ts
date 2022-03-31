import { BinaryExpression, Expression } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';

export const createCompareOperatorHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '>' | '<' | '>=' | '<=' }
  >(
    (source, config, node) => {
      return withTrailingConversionComment(
        binaryExpression(
          handleExpression(source, config, node.left as Expression),
          node.operator,
          handleExpression(source, config, node.right)
        ),
        `ROBLOX CHECK: operator '${node.operator}' works only if either both arguments are strings or both are a number`
      );
    },
    { skipComments: true }
  );
};
