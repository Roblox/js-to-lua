import { Expression, isArrayExpression } from '@babel/types';

export const isArrayNode = (expression: Expression): boolean => {
  return isArrayExpression(expression);
};
