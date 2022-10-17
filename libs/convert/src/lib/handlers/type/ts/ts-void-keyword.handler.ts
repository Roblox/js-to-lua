import { TSVoidKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { withVoidTypePolyfillExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaType, typeReference } from '@js-to-lua/lua-types';

export const createTsVoidKeywordHandler = () =>
  createHandler<LuaType, TSVoidKeyword>('TSVoidKeyword', () =>
    withVoidTypePolyfillExtra(typeReference(identifier('void')))
  );
