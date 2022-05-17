import { TSArrayType, TSType } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { withPolyfillTypeExtra } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';

export const createTsArrayTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSArrayType>(
    'TSArrayType',
    (source, config, node) => {
      return withPolyfillTypeExtra<LuaTypeReference, 'Array'>('Array', ['T'])(
        typeReference(identifier('Array'), [
          typesHandlerFunction(source, config, node.elementType),
        ])
      );
    }
  );
