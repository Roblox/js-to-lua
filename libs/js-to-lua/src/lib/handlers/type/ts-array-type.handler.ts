import { TSArrayType, TSType } from '@babel/types';
import { withPolyfillTypeExtra } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '../../types';

export const createTsArrayTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSArrayType>(
    'TSArrayType',
    (source, config, node) => {
      return withPolyfillTypeExtra('Array', ['T'])(
        typeReference(identifier('Array'), [
          typesHandlerFunction(source, config, node.elementType),
        ])
      );
    }
  );
