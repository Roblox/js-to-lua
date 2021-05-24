import { BaseNodeHandler } from '../types';

export const defaultTypeHandler: BaseNodeHandler['handler'] = () => {
  return {
    type: 'LuaTypeAny',
  };
};
