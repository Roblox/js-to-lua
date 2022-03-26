import {
  CallExpression,
  Expression,
  isExpression,
  isSpreadElement,
  Node,
  SpreadElement,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaExpression } from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createSpreadElementPropertiesHandler } from '../spread-element-properties.handler';
import { tableUnpackCall } from './know-array-methods/utils';

export const createCallExpressionArgumentsHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const spreadElementPropertiesHandler =
    createSpreadElementPropertiesHandler(handleExpression);
  return (
    source: string,
    config: EmptyConfig,
    args: CallExpression['arguments']
  ): LuaExpression[] => {
    const toExpression = handleExpression(source, config);

    const isExpressionOrSpreadElement = (
      nodes: Array<Node>
    ): nodes is Array<Expression | SpreadElement> =>
      nodes.every((node) => isExpression(node) || isSpreadElement(node));

    if (
      isExpressionOrSpreadElement(args) &&
      args.some((arg) => isSpreadElement(arg))
    ) {
      const propertiesGroups = args.reduce(
        splitBy<Expression | SpreadElement, SpreadElement>(isSpreadElement),
        []
      );

      return applyTo(
        spreadElementPropertiesHandler(
          source,
          { ...config, forceConcat: false },
          propertiesGroups
        )
      )((node) => (Array.isArray(node) ? node : [node])).map(
        (node, index, arr) =>
          index === arr.length - 1 ? tableUnpackCall(node) : node
      );
    }
    return args.map(toExpression);
  };
};
