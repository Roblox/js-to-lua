import { Expression } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { isStringInferable } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';

export const createOperandAsStringHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandlerFunction<LuaCallExpression | LuaExpression, Expression>(
    (source, config, node) => {
      const operandNode = handleExpression(source, config, node);

      if (isStringInferable(operandNode)) {
        return operandNode;
      }
      return callExpression(identifier('tostring'), [operandNode]);
    }
  );
};
