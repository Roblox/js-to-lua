import { TSNeverKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { identifier, LuaType, typeReference } from '@js-to-lua/lua-types';

export const createTsNeverKeywordHandler = () =>
  createHandler<LuaType, TSNeverKeyword>('TSNeverKeyword', () =>
    typeReference(identifier('never'))
  );
