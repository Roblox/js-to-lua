import { TSArrayType, TSType } from '@babel/types';
import {
  LuaTypeReference,
  typeReference,
  identifier,
  LuaType,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '../../types';

export const createTsArrayTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSArrayType>(
    'TSArrayType',
    (source, config, node) => {
      return typeReference(identifier('Array'), [
        typesHandlerFunction(source, config, node.elementType),
      ]);
    }
  );
