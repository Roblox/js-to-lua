import { TSTypePredicate } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { LuaType, typeBoolean } from '@js-to-lua/lua-types';

export const createTsTypePredicateHandler = () =>
  createHandler<LuaType, TSTypePredicate>(
    'TSTypePredicate',
    (source, config, node) =>
      withTrailingConversionComment(
        typeBoolean(),
        'ROBLOX FIXME: change to TSTypePredicate equivalent if supported',
        getNodeSource(source, node)
      )
  );
