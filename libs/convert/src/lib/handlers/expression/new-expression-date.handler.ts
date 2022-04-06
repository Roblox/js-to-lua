import { NewExpression } from '@babel/types';
import {
  createOptionalHandlerFunction,
  handleComments,
} from '@js-to-lua/handler-utils';
import {
  dateTimeMethod,
  isDateIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import { callExpression, LuaExpression } from '@js-to-lua/lua-types';

export const createNewDateOptionalHandlerFunction = () => {
  return createOptionalHandlerFunction<LuaExpression, NewExpression>(
    (source, config, node) => {
      if (isDateIdentifier(node.callee) && !node.arguments.length) {
        return callExpression(
          handleComments(source, node.callee, dateTimeMethod('now')),
          []
        );
      }
    }
  );
};
