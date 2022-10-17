import { TSBooleanKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaType, typeBoolean } from '@js-to-lua/lua-types';

export const createTsBooleanKeywordHandler = () =>
  createHandler<LuaType, TSBooleanKeyword>('TSBooleanKeyword', () =>
    typeBoolean()
  );
