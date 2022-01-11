import { TSArrayType, TSType } from '@babel/types';
import {
  LuaTypeReference,
  typeReference,
  identifier,
  LuaType,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '../../types';
import { withPolyfillTypeExtra } from '../../utils/with-polyfill-type-extra';

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
