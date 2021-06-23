import { LuaExpression } from '@js-to-lua/lua-types';
import { createHandlerFunction } from '../types';

export const mockNode = (): LuaExpression =>
  (({
    type: 'MockNode',
  } as unknown) as LuaExpression);

export const mockNodeHandler = createHandlerFunction(mockNode);
