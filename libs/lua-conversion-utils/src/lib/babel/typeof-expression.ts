import { isUnaryExpression, UnaryExpression } from '@babel/types';

export const isTypeofExpression = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  node: object
): node is UnaryExpression & { operator: 'typeof' } =>
  isUnaryExpression(node) && node.operator === 'typeof';
