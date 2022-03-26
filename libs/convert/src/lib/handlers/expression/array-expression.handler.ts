import {
  ArrayExpression,
  Expression,
  isSpreadElement,
  SpreadElement,
} from '@babel/types';
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

type ArrayExpressionElement = Unpacked<ArrayExpression['elements']>;

export const createArrayExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaTableConstructor | LuaCallExpression,
  ArrayExpression
> => {
  const handleExpressionTableNoKeyFieldHandler: HandlerFunction<
    LuaTableNoKeyField,
    Expression
  > = createHandlerFunction((source, config, expression: Expression) =>
    tableNoKeyField(handleExpression(source, config, expression))
  );

  const spreadElementPropertiesHandler =
    createSpreadElementPropertiesHandler(handleExpression);

  const handleArrayExpressionWithSpread: HandlerFunction<
    LuaCallExpression,
    ArrayExpression
  > = createHandlerFunction((source, config, expression: ArrayExpression) => {
    const propertiesGroups = expression.elements
      .filter(isTruthy)
      .reduce(
        splitBy<NonNullable<ArrayExpressionElement>, SpreadElement>(
          isSpreadElement
        ),
        []
      );

    return spreadElementPropertiesHandler(
      source,
      { ...config, forceConcat: true },
      propertiesGroups
    );
  });

  type ArrayExpressionWithoutSpread = ArrayExpression;
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
    (source, config, expression: ArrayExpression) =>
      expression.elements.every(
        (element) => !element || element.type !== 'SpreadElement'
      )
        ? handleArrayExpressionWithoutSpread(source, config, expression)
        : handleArrayExpressionWithSpread(source, config, expression)
  );
};
