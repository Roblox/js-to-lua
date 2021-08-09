import { createHandler, HandlerFunction } from '../../types';
import {
  LuaIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import {
  Identifier,
  TSEntityName,
  TSType,
  TSTypeReference,
} from '@babel/types';
import { combineHandlers } from '../../utils/combine-handlers';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

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

      return typeReference(
        handleTypeName(node.typeName),
        (node.typeParameters &&
          node.typeParameters.params.length &&
          (node.typeParameters.params.map(
            handleType
          ) as NonEmptyArray<LuaTypeReference>)) ||
          undefined
      );
    }
  );
