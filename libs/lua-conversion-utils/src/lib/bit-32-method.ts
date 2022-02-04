import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { bit32Identifier } from './creators';

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
