import { LuaExpression } from '@js-to-lua/lua-types';
import { createHandlerFunction, EmptyConfig } from '../types';

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

export const mockNodeHandler = createHandlerFunction(mockNode);
export const mockNodeWithValueHandler = createHandlerFunction(
  <T>(source: string, config: EmptyConfig, node: T) => mockNodeWithValue(node)
);
