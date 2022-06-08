import { Expression, ObjectExpression } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaExpression, LuaTableKeyField } from '@js-to-lua/lua-types';
import { createObjectExpressionWithSpreadHandler } from './object-expression-with-spread.handler';
import { createObjectExpressionWithoutSpreadHandler } from './object-expression-without-spread.handler';
import { NoSpreadObjectProperty } from './object-expression.types';

export const createObjectExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  objectFieldHandlerFunction: HandlerFunction<
    LuaTableKeyField,
    NoSpreadObjectProperty
  >
) => {
  const handleObjectExpressionWithSpread =
    createObjectExpressionWithSpreadHandler(
      expressionHandlerFunction,
      objectFieldHandlerFunction
    );

  const handleObjectExpressionWithoutSpread =
    createObjectExpressionWithoutSpreadHandler(objectFieldHandlerFunction);

  return createHandler(
    'ObjectExpression',
    (source, config, expression: ObjectExpression) =>
      expression.properties.every((prop) => prop.type !== 'SpreadElement')
        ? handleObjectExpressionWithoutSpread(source, config, expression)
        : handleObjectExpressionWithSpread(source, config, expression)
  );
};
