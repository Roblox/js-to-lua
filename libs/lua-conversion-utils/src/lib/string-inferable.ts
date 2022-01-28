import {
  isBinaryExpression,
  isMultilineStringLiteral,
  isStringLiteral,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const stringInferableExpression = withExtras({
  isStringInferable: true,
});

export const isStringInferable = (
  node: LuaExpression & { extras?: { isStringInferable?: boolean } }
) =>
  isStringLiteral(node) ||
  isMultilineStringLiteral(node) ||
  (isBinaryExpression(node) && node.operator === '..') ||
  node.extras?.isStringInferable;
