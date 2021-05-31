import { BaseNodeHandler, HandlerFunction } from '../types';
import {
  ArrayExpression,
  Expression,
  isSpreadElement,
  SpreadElement,
} from '@babel/types';
import {
  LuaCallExpression,
  LuaExpression,
  LuaTableConstructor,
  LuaTableNoKeyField,
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
  > = (expression) => ({
    type: 'TableNoKeyField',
    value: handleExpression(expression),
  });

  const handleSpreadExpression: HandlerFunction<
    SpreadElement,
    LuaExpression
  > = (spreadElement) =>
    spreadElement.argument.type === 'ArrayExpression'
      ? handleExpression(spreadElement.argument)
      : {
          type: 'CallExpression',
          callee: {
            // TODO: Replace identifier with member expression.
            type: 'Identifier',
            name: 'Array.spread',
          },
          arguments: [handleExpression(spreadElement.argument)],
        };

  const handleArrayExpressionWithSpread: HandlerFunction<
    ArrayExpression,
    LuaCallExpression
  > = (expression) => {
    const propertiesGroups = expression.elements
      .filter(Boolean)
      .reduce(
        splitBy<ArrayExpressionElement, SpreadElement>(isSpreadElement),
        []
      );
    const args: LuaExpression[] = propertiesGroups.map((group) => {
      return Array.isArray(group)
        ? {
            type: 'TableConstructor',
            elements: group.map(handleExpressionTableNoKeyFieldHandler),
          }
        : handleSpreadExpression(group);
    });

    // TODO: Replace identifier with member expression.
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'Array.concat',
      },
      arguments: [
        {
          type: 'TableConstructor',
          elements: [],
        },
        ...args,
      ],
    };
  };

  type ArrayExpressionWithoutSpread = ArrayExpression;

  const handleArrayExpressionWithoutSpread: HandlerFunction<
    ArrayExpressionWithoutSpread,
    LuaTableConstructor
  > = ({ elements }) => {
    return {
      type: 'TableConstructor',
      elements: elements.map(handleExpressionTableNoKeyFieldHandler),
    };
  };

  return {
    type: 'ArrayExpression',
    handler: (expression) => {
      return expression.elements.every(
        (element) => element.type !== 'SpreadElement'
      )
        ? handleArrayExpressionWithoutSpread(expression)
        : handleArrayExpressionWithSpread(expression);
    },
  };
};
