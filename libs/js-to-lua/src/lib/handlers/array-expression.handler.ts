import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import {
  ArrayExpression,
  Expression,
  isSpreadElement,
  SpreadElement,
} from '@babel/types';
import {
  arrayConcat,
  arraySpread,
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaTableConstructor,
  LuaTableNoKeyField,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { splitBy } from '../utils/split-by';
import { Unpacked } from '../utils/types';

type ArrayExpressionElement = Unpacked<ArrayExpression['elements']>;

export const createArrayExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<
  ArrayExpression,
  LuaTableConstructor | LuaCallExpression
> => {
  const handleExpressionTableNoKeyFieldHandler: HandlerFunction<
    Expression,
    LuaTableNoKeyField
  > = createHandlerFunction((source, expression: Expression) =>
    tableNoKeyField(handleExpression(source, expression))
  );

  const handleSpreadExpression: HandlerFunction<
    SpreadElement,
    LuaExpression
  > = createHandlerFunction((source, spreadElement: SpreadElement) =>
    spreadElement.argument.type === 'ArrayExpression'
      ? handleExpression(source, spreadElement.argument)
      : callExpression(arraySpread(), [
          handleExpression(source, spreadElement.argument),
        ])
  );

  const handleArrayExpressionWithSpread: HandlerFunction<
    ArrayExpression,
    LuaCallExpression
  > = createHandlerFunction((source, expression: ArrayExpression) => {
    const propertiesGroups = expression.elements
      .filter(Boolean)
      .reduce(
        splitBy<ArrayExpressionElement, SpreadElement>(isSpreadElement),
        []
      );
    const args: LuaExpression[] = propertiesGroups.map((group) => {
      return Array.isArray(group)
        ? tableConstructor(
            group.map(handleExpressionTableNoKeyFieldHandler(source))
          )
        : handleSpreadExpression(source, group);
    });

    return callExpression(arrayConcat(), [tableConstructor([]), ...args]);
  });

  type ArrayExpressionWithoutSpread = ArrayExpression;

  const handleArrayExpressionWithoutSpread: HandlerFunction<
    ArrayExpressionWithoutSpread,
    LuaTableConstructor
  > = createHandlerFunction(
    (source, { elements }: ArrayExpressionWithoutSpread) =>
      tableConstructor(
        elements.map(handleExpressionTableNoKeyFieldHandler(source))
      )
  );

  return createHandler('ArrayExpression', (source, expression) =>
    expression.elements.every((element) => element.type !== 'SpreadElement')
      ? handleArrayExpressionWithoutSpread(source, expression)
      : handleArrayExpressionWithSpread(source, expression)
  );
};
