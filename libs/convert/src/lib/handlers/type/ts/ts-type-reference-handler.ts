import {
  Identifier,
  TSQualifiedName,
  TSType,
  TSTypeReference,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  PolyfillTypeID,
  requiresTsTypePolyfill,
  withPolyfillTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { createTsEntityNameHandler } from './ts-entity-name.handler';
import { createTsTypeReferenceSpecialCasesHandler } from './ts-type-reference-special-cases.handler';

export const createTsTypeReferenceHandler = (
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  tsQualifiedNameHandler: BaseNodeHandler<LuaIdentifier, TSQualifiedName>,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaType, TSTypeReference>(
    'TSTypeReference',
    (source, config, node) => {
      const handled = createTsTypeReferenceSpecialCasesHandler(
        identifierHandlerFunction,
        tsQualifiedNameHandler,
        tsTypeHandlerFunction
      )(source, config, node);

      if (handled) return handled;

      const handleType = tsTypeHandlerFunction(source, config);
      const handleTsEntityName = createTsEntityNameHandler(
        identifierHandlerFunction,
        tsQualifiedNameHandler
      )(source, config);
      const id = handleTsEntityName(node.typeName);

      const polyfillType = requiresTsTypePolyfill.find(
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
