import { TSUndefinedKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaType, typeNil } from '@js-to-lua/lua-types';

export const createTsUndefinedKeywordHandler = () =>
  createHandler<LuaType, TSUndefinedKeyword>('TSUndefinedKeyword', () =>
    typeNil()
  );
