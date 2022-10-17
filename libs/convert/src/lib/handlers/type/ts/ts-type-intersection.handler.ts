import { TSIntersectionType, TSType } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType, typeIntersection } from '@js-to-lua/lua-types';

export const createTsTypeIntersectionHandler = (
  handleTsType: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaType, TSIntersectionType>(
    'TSIntersectionType',
    (source, config, node) =>
      typeIntersection(node.types.map(handleTsType(source, config)))
  );
