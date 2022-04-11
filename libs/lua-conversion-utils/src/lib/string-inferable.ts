import {
  isBinaryExpression,
  isMultilineStringLiteral,
  isStringLiteral,
  LuaExpression,
  LuaNode,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const stringInferableExpression = <N extends LuaNode>(node: N) =>
  withExtras<{ isStringInferable: true }, N>({
    isStringInferable: true,
  })(node);

export const isStringInferable = (
  node: LuaExpression & { extras?: { isStringInferable?: boolean } }
) =>
  isStringLiteral(node) ||
  isMultilineStringLiteral(node) ||
  (isBinaryExpression(node) && node.operator === '..') ||
  node.extras?.isStringInferable;
