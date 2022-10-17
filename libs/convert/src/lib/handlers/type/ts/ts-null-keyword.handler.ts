import { TSNullKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { LuaType, typeNil } from '@js-to-lua/lua-types';

export const createTsNullKeywordHandler = () =>
  createHandler<LuaType, TSNullKeyword>('TSNullKeyword', () =>
    withTrailingConversionComment(
      typeNil(),
      "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
    )
  );
