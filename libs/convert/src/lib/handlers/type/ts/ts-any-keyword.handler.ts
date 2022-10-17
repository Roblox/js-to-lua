import { TSAnyKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaType, typeAny } from '@js-to-lua/lua-types';

export const createTsAnyKeywordHandler = () =>
  createHandler<LuaType, TSAnyKeyword>('TSAnyKeyword', () => typeAny());
