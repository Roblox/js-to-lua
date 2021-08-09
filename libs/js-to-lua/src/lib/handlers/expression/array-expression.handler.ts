import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../../types';
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
import { isTruthy, splitBy, Unpacked } from '@js-to-lua/shared-utils';

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

  const handleSpreadExpression: HandlerFunction<
    LuaExpression,
    SpreadElement
  > = createHandlerFunction((source, config, spreadElement: SpreadElement) =>
    spreadElement.argument.type === 'ArrayExpression'
      ? handleExpression(source, config, spreadElement.argument)
      : callExpression(arraySpread(), [
          handleExpression(source, config, spreadElement.argument),
        ])
  );

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
    const args: LuaExpression[] = propertiesGroups.map((group) => {
      return Array.isArray(group)
        ? tableConstructor(
            group.map(handleExpressionTableNoKeyFieldHandler(source, config))
          )
        : handleSpreadExpression(source, config, group);
    });

    return callExpression(arrayConcat(), [tableConstructor([]), ...args]);
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
