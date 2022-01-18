import { withExtras } from './lua-nodes.creators';
import { LuaExpression } from './expression';
import { isTableConstructor, isTableNoKeyField } from './literals';

export const arrayInferableExpression = withExtras({
  isArrayInferable: true,
});

export const isArrayInferable = <T extends LuaExpression>(
  node: T & { extras?: { isArrayInferable?: boolean } }
) =>
  (isTableConstructor(node) && node.elements.every(isTableNoKeyField)) ||
  node.extras?.isArrayInferable;
