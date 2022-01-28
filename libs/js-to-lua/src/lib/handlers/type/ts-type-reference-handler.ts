import {
  Identifier,
  TSEntityName,
  TSType,
  TSTypeReference,
} from '@babel/types';
import {
  requiresTypePolyfill,
  withPolyfillTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { createHandler, HandlerFunction } from '../../types';
import { combineHandlers } from '../../utils/combine-handlers';

export const createTsTypeReferenceHandler = (
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSTypeReference>(
    'TSTypeReference',
    (source, config, node) => {
      const typeNameHandler = combineHandlers<LuaIdentifier, TSEntityName>(
        [],
        identifierHandlerFunction
      ).handler;

      const handleType = tsTypeHandlerFunction(source, config);
      const handleTypeName = typeNameHandler(source, config);
      const id = handleTypeName(node.typeName);

      const polyfillType = requiresTypePolyfill.find(
        (type) => type.name === id.name
      );

      return typeReference(
        polyfillType
          ? withPolyfillTypeExtra(polyfillType.name, polyfillType.generics)(id)
          : id,
        (node.typeParameters &&
          node.typeParameters.params.length &&
          (node.typeParameters.params.map(
            handleType
          ) as NonEmptyArray<LuaTypeReference>)) ||
          undefined
      );
    }
  );
