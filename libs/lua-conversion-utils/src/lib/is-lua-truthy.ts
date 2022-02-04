import { Expression } from '@babel/types';

export const isLuaTruthy = (expression: Expression): boolean => {
  const isTruthyPredicates = [
    (e: Expression): boolean => e.type === 'NumericLiteral',
    (e: Expression): boolean => e.type === 'StringLiteral',
    (e: Expression): boolean => e.type === 'BooleanLiteral' && e.value,
    (e: Expression): boolean => e.type === 'ObjectExpression',
    (e: Expression): boolean => e.type === 'ArrayExpression',
    (e: Expression): boolean => e.type === 'Identifier' && e.name === 'NaN',
  ];

  return isTruthyPredicates.some((predicate) => predicate(expression));
};
