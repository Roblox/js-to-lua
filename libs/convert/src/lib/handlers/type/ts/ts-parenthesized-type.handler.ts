import * as Babel from '@babel/types';
import { TSType } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType } from '@js-to-lua/lua-types';

export const createTsParenthesizedTypeHandler = (
  handleTsTypes: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaType, Babel.TSParenthesizedType>(
    'TSParenthesizedType',
    (source, config, node) => handleTsTypes(source, config, node.typeAnnotation)
  );
