import { CallExpression } from '@babel/types';
import {
  createOptionalHandlerFunction,
  handleComments,
} from '@js-to-lua/handler-utils';
import {
  dateTimeMethodCall,
  isDateMethod,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export const createCallExpressionDateMethodHandler = () => {
  return createOptionalHandlerFunction<LuaExpression, CallExpression>(
    (source, config, node) => {
      if (isDateMethod('now')(node.callee) && !node.arguments.length) {
        return handleComments(
          source,
          node.callee,
          memberExpression(
            handleComments(
              source,
              node.callee.object,
              dateTimeMethodCall('now')
            ),
            '.',
            handleComments(
              source,
              node.callee.property,
              identifier('UnixTimestampMillis')
            )
          )
        );
      }
    }
  );
};
