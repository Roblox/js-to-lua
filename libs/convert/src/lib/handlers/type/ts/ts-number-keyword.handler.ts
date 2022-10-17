import { TSNumberKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaType, typeNumber } from '@js-to-lua/lua-types';

export const createTsNumberKeywordHandler = () =>
  createHandler<LuaType, TSNumberKeyword>('TSNumberKeyword', () =>
    typeNumber()
  );
