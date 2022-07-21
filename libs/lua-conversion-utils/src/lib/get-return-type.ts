import { functionReturnType, LuaType } from '@js-to-lua/lua-types';
import { reassignComments } from './comment';
import { hasVoid } from './extras';

export const getReturnType = (returnType: LuaType) =>
  hasVoid(returnType)
    ? reassignComments(functionReturnType([]), returnType)
    : functionReturnType([returnType]);
