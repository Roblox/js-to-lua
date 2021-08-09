import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from '../type';
import { LuaExpression } from './expression';

export interface TypeCastExpression extends BaseLuaNode {
  type: 'TypeCastExpression';
  expression: LuaExpression;
  typeAnnotation: LuaType;
}

export const typeCastExpression = (
  expression: TypeCastExpression['expression'],
  typeAnnotation: TypeCastExpression['typeAnnotation']
): TypeCastExpression => ({
  type: 'TypeCastExpression',
  expression,
  typeAnnotation,
});

export const isTypeCastExpression = isNodeType<TypeCastExpression>(
  'TypeCastExpression'
);
