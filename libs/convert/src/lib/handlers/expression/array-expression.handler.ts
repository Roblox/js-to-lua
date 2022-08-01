import * as Babel from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaCallExpression,
  LuaExpression,
  LuaTableConstructor,
  LuaTableNoKeyField,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { isTruthy, splitBy, Unpacked } from '@js-to-lua/shared-utils';
import { createSpreadElementPropertiesHandler } from './spread-element-properties.handler';

type ArrayExpressionElement = Unpacked<Babel.ArrayExpression['elements']>;

export const createArrayExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
): BaseNodeHandler<
  LuaTableConstructor | LuaCallExpression,
  Babel.ArrayExpression
> => {
  const handleExpressionTableNoKeyFieldHandler: HandlerFunction<
    LuaTableNoKeyField,
    Babel.Expression
  > = createHandlerFunction((source, config, expression: Babel.Expression) =>
    tableNoKeyField(handleExpression(source, config, expression))
  );

  const spreadElementPropertiesHandler =
    createSpreadElementPropertiesHandler(handleExpression);

  const handleArrayExpressionWithSpread: HandlerFunction<
    LuaCallExpression,
    Babel.ArrayExpression
  > = createHandlerFunction(
    (source, config, expression: Babel.ArrayExpression) => {
      const propertiesGroups = expression.elements
        .filter(isTruthy)
        .reduce(
          splitBy<NonNullable<ArrayExpressionElement>, Babel.SpreadElement>(
            Babel.isSpreadElement
          ),
          []
        );

      return spreadElementPropertiesHandler(
        source,
        { ...config, forceConcat: true },
        propertiesGroups
      );
    }
  );

  type ArrayExpressionWithoutSpread = Babel.ArrayExpression;
  const handleArrayExpressionWithoutSpread: HandlerFunction<
    LuaTableConstructor,
    ArrayExpressionWithoutSpread
  > = createHandlerFunction(
    (source, config, { elements }: ArrayExpressionWithoutSpread) =>
      tableConstructor(
        elements
          .filter(isTruthy)
          .map(handleExpressionTableNoKeyFieldHandler(source, config))
      )
  );

  return createHandler(
    'ArrayExpression',
    (source, config, expression: Babel.ArrayExpression) =>
      expression.elements.every(
        (element) => !element || !Babel.isSpreadElement(element)
      )
        ? handleArrayExpressionWithoutSpread(source, config, expression)
        : handleArrayExpressionWithSpread(source, config, expression)
  );
};
