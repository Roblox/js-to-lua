import { TSQualifiedName, TSType, TSTypeReference } from '@babel/types';
import {
  BaseNodeHandler,
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  requiresTsBuiltInType,
  TsBuiltInTypeId,
  withTsBuiltInTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsEntityNameHandler } from './ts-entity-name.handler';

export const createTsTypeReferenceBuiltInHandler = (
  identifierHandlerFunction: IdentifierStrictHandlerFunction,
  tsQualifiedNameHandler: BaseNodeHandler<LuaIdentifier, TSQualifiedName>,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createOptionalHandlerFunction<LuaType, TSTypeReference>(
    (source, config, node) => {
      const handleTsEntityName = createTsEntityNameHandler(
        identifierHandlerFunction,
        tsQualifiedNameHandler
      )(source, config);

      const id = handleTsEntityName(node.typeName);

      const builtInType = requiresTsBuiltInType.find(
        (type) => type.name === id.name
      );

      const handleType = tsTypeHandlerFunction(source, config);

      return builtInType
        ? withTsBuiltInTypeExtra<LuaType, TsBuiltInTypeId>(
            builtInType.name,
            builtInType.generics
          )(
            typeReference(
              id,
              (node.typeParameters?.params?.length &&
                (node.typeParameters.params.map(
                  handleType
                ) as NonEmptyArray<LuaTypeReference>)) ||
                undefined
            )
          )
        : undefined;
    }
  );
