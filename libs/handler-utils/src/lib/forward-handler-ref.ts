import { LuaExpression, LuaNode, LuaStatement } from '@js-to-lua/lua-types';
import {
  AsStatementHandlerFunction,
  BaseNodeAsStatementHandler,
  createAsStatementHandlerFunction,
} from './as-statement';
import { createHandlerFunction } from './create-handler-function';
import {
  NonCurriedAsStatementHandlerFunction,
  NonCurriedHandlerFunction,
} from './inner-types';
import { BabelNode, BaseNodeHandler, HandlerFunction } from './types';

export const forwardHandlerRef = <
  R extends LuaNode,
  T extends BabelNode = BabelNode
>(
  handleFactory: () => BaseNodeHandler<R, T>
): HandlerFunction<R, T> =>
  createHandlerFunction(
    (...args) =>
      (handleFactory().handler as NonCurriedHandlerFunction<R, T>)(...args), // TODO fix typing error
    { skipComments: true }
  );

export const forwardHandlerFunctionRef = <
  R extends LuaNode,
  T extends BabelNode = BabelNode
>(
  handleFactory: () => HandlerFunction<R, T>
): HandlerFunction<R, T> =>
  createHandlerFunction(
    (...args) => (handleFactory() as NonCurriedHandlerFunction<R, T>)(...args), // TODO fix typing error
    { skipComments: true }
  );

export const forwardAsStatementHandlerRef = <
  R extends LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression
>(
  handleFactory: () => BaseNodeAsStatementHandler<R, T, I>
): AsStatementHandlerFunction<R, T, I> =>
  createAsStatementHandlerFunction(
    (...args) => {
      return (
        handleFactory().handler as NonCurriedAsStatementHandlerFunction<R, T, I>
      )(...args); // TODO fix typing error
    },
    { skipComments: true }
  );
