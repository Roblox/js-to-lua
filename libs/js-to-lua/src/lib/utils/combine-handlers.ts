import {
  BaseNodeHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import {
  defaultExpressionHandler,
  defaultStatementHandler,
  defaultTypeAnnotationHandler,
} from './default-handlers';
import {
  LuaExpression,
  LuaNode,
  LuaStatement,
  LuaTypeAnnotation,
} from '@js-to-lua/lua-types';

export const combineHandlers = <
  R extends LuaNode,
  H extends BaseNodeHandler<R>
>(
  ons: H[],
  fallback: HandlerFunction<R>
): H => {
  return {
    type: ons.map(({ type }) => type).flat(),
    handler: createHandlerFunction((source, node) => {
      const { handler } = ons.find((on) => {
        const types = Array.isArray(on.type) ? on.type : [on.type];
        return types.includes(node.type);
      }) || { handler: fallback };

      return handler(source, node);
    }),
  } as H;
};

export const combineStatementHandlers = <
  R extends LuaStatement = LuaStatement,
  H extends BaseNodeHandler<R> = BaseNodeHandler<R>
>(
  ons: H[]
): H => combineHandlers(ons, defaultStatementHandler);

export const combineExpressionsHandlers = <
  R extends LuaExpression = LuaExpression,
  H extends BaseNodeHandler<R> = BaseNodeHandler<R>
>(
  ons: H[]
): H => combineHandlers(ons, defaultExpressionHandler);

export const combineTypeAnnotationHandlers = <
  R extends LuaTypeAnnotation = LuaTypeAnnotation,
  H extends BaseNodeHandler<R> = BaseNodeHandler<R>
>(
  ons: H[]
): H => combineHandlers(ons, defaultTypeAnnotationHandler);
