import {
  isExpression,
  isLuaNode,
  isStringLiteral,
  LuaExpression,
  LuaNode,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type AlternativeExpressionExtra<T extends LuaExpression = LuaExpression> = {
  alternativeExpression: T;
};

export const createWithAlternativeExpressionExtras =
  (alternativeExpression: LuaExpression) =>
  <N extends LuaNode>(node: N) =>
    withExtras<AlternativeExpressionExtra, N>({
      alternativeExpression: alternativeExpression,
    })(node);

export const isWithAlternativeExpressionExtras = <N extends LuaNode>(
  node: N
): node is N & WithExtras<N, AlternativeExpressionExtra> => {
  const alternativeExpression = node.extras?.['alternativeExpression'];
  return (
    isLuaNode(alternativeExpression) && isExpression(alternativeExpression)
  );
};
export const isWithAlternativeStringLiteralExtras = <N extends LuaNode>(
  node: N
): node is N & WithExtras<N, AlternativeExpressionExtra<LuaStringLiteral>> =>
  isWithAlternativeExpressionExtras(node) &&
  isStringLiteral(getAlternativeExpressionExtra<N>(node));

export const getAlternativeExpressionExtra = <
  N extends LuaNode,
  ExpressionType extends LuaExpression = LuaExpression
>(
  node: WithExtras<N, AlternativeExpressionExtra<ExpressionType>>
): ExpressionType => node.extras.alternativeExpression;
