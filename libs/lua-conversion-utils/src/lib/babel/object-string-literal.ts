import { isStringLiteral, StringLiteral } from '@babel/types';

export const isObjectStringLiteral = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  node: object
): node is StringLiteral & { value: 'object' } =>
  isStringLiteral(node) && node.value === 'object';
