import { LuaExpression } from '@js-to-lua/lua-types';

export const mockNode = <R = LuaExpression>(): R =>
  ({
    type: 'MockNode',
  } as unknown as R);

export const mockNodeWithValue = <R = LuaExpression, T = unknown>(
  value: T
): R =>
  ({
    type: 'MockNode',
    value,
  } as unknown as R);
