import { BaseNodeHandler } from '../types';

export const defaultTypeHandler: BaseNodeHandler['handler'] = (node) => {
  return {
    type: 'LuaTypeAny',
  };
};
