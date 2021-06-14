import { createHandlerFunction, HandlerFunction } from '../types';

export const defaultTypeHandler: HandlerFunction = createHandlerFunction(() => {
  return {
    type: 'LuaTypeAny',
  };
});
