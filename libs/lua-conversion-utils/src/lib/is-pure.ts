import {
  isIdentifier,
  isMemberExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { pipe, not } from 'ramda';

export const isPure = (node: LuaExpression): boolean =>
  isIdentifier(node) || isMemberExpression(node);
export const isNotPure = pipe(isPure, not);
