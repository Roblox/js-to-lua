import { createHandlerFunction, HandlerFunction } from '../types';
import { LuaTypeAny } from '@js-to-lua/lua-types';

export const defaultTypeHandler: HandlerFunction<LuaTypeAny> = createHandlerFunction(
  () => {
    return {
      type: 'LuaTypeAny',
    };
  }
);
