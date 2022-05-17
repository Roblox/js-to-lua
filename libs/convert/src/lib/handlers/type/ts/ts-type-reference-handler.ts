import {
  Identifier,
  TSEntityName,
  TSQualifiedName,
  TSType,
  TSTypeReference,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  PolyfillTypeID,
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

export const createTsTypeReferenceHandler = (
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  tsQualifiedNameHandler: BaseNodeHandler<LuaIdentifier, TSQualifiedName>,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeReference, TSTypeReference>(
    'TSTypeReference',
    (source, config, node) => {
      const typeNameHandler = combineHandlers<LuaIdentifier, TSEntityName>(
        [tsQualifiedNameHandler],
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
          ? withPolyfillTypeExtra<LuaIdentifier, PolyfillTypeID>(
              polyfillType.name,
              polyfillType.generics
            )(id)
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
