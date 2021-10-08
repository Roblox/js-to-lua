import { TSTupleType, TSType } from '@babel/types';
import {
  identifier,
  LuaType,
  LuaTypeReference,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '../../types';

export const createTsTupleTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSTupleType>(
    'TSTupleType',
    (source, config, node) => {
      const handleType = typesHandlerFunction(source, config);
      const types = node.elementTypes.map(handleType);
      return typeReference(identifier('Array'), [
        types.length > 1 ? typeUnion(types) : types[0],
      ]);
    }
  );
