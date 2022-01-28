import { bit32Identifier } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export type Bit32Method =
  | 'band'
  | 'bor'
  | 'bxor'
  | 'rshift'
  | 'arshift'
  | 'lshift';

export const bit32MethodCall = (
  methodName: Bit32Method,
  left: LuaExpression,
  right: LuaExpression
) =>
  callExpression(
    memberExpression(bit32Identifier(), '.', identifier(methodName)),
    [left, right]
  );
