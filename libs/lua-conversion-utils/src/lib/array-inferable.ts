import {
  isTableConstructor,
  isTableNoKeyField,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const arrayInferableExpression = withExtras({
  isArrayInferable: true,
});

export const isArrayInferable = <T extends LuaExpression>(
  node: T & { extras?: { isArrayInferable?: boolean } }
) =>
  (isTableConstructor(node) && node.elements.every(isTableNoKeyField)) ||
  node.extras?.isArrayInferable === true;
