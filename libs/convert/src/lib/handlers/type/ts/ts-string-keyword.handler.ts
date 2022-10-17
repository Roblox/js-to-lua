import { TSStringKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaType, typeString } from '@js-to-lua/lua-types';

export const createTsStringKeywordHandler = () =>
  createHandler<LuaType, TSStringKeyword>('TSStringKeyword', () =>
    typeString()
  );
