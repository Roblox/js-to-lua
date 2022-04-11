import {
  isExpression,
  isLuaNode,
  LuaExpression,
  LuaNode,
} from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type AlternativeExpressionExtra = {
  alternativeExpression: LuaExpression;
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

export const getAlternativeExpressionExtra = <N extends LuaNode>(
  node: WithExtras<N, AlternativeExpressionExtra>
): LuaExpression => node.extras.alternativeExpression;
