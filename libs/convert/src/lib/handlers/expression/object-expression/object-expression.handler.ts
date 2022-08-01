import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaExpression, LuaTableKeyField } from '@js-to-lua/lua-types';
import { createObjectExpressionWithSpreadHandler } from './object-expression-with-spread.handler';
import { createObjectExpressionWithoutSpreadHandler } from './object-expression-without-spread.handler';
import { NoSpreadObjectProperty } from './object-expression.types';

export const createObjectExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>,
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
    (source, config, expression: Babel.ObjectExpression) =>
      expression.properties.every((prop) => !Babel.isSpreadElement(prop))
        ? handleObjectExpressionWithoutSpread(source, config, expression)
        : handleObjectExpressionWithSpread(source, config, expression)
  );
};
