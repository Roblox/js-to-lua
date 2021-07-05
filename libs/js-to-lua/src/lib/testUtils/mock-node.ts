import { LuaExpression } from '@js-to-lua/lua-types';
import { createHandlerFunction } from '../types';

export const mockNode = (): LuaExpression =>
  (({
    type: 'MockNode',
  } as unknown) as LuaExpression);

export const mockNodeWithValue = <T>(value: T): LuaExpression =>
  (({
    type: 'MockNode',
    value,
  } as unknown) as LuaExpression);

export const mockNodeHandler = createHandlerFunction(mockNode);
export const mockNodeWithValueHandler = createHandlerFunction(
  <T>(source: string, node: T) => mockNodeWithValue(node)
);
