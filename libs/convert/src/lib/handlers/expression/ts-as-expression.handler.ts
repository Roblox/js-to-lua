import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaType,
  typeCastExpression,
  TypeCastExpression,
} from '@js-to-lua/lua-types';
import { Expression, TSAsExpression, TSType } from '@babel/types';

export const createTsAsExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<TypeCastExpression, TSAsExpression>(
    'TSAsExpression',
    (source, config, node) =>
      typeCastExpression(
        expressionHandlerFunction(source, config, node.expression),
        typeHandlerFunction(source, config, node.typeAnnotation)
      )
  );
