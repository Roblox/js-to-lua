import {
  isTableConstructor,
  isTableNoKeyField,
  LuaExpression,
  LuaNode,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const arrayInferableExpression = <N extends LuaNode>(node: N) =>
  withExtras<{ isArrayInferable: true }, N>({
    isArrayInferable: true,
  })(node);

export const isArrayInferable = <T extends LuaExpression>(
  node: T & { extras?: { isArrayInferable?: boolean } }
) =>
  (isTableConstructor(node) && node.elements.every(isTableNoKeyField)) ||
  node.extras?.isArrayInferable === true;
