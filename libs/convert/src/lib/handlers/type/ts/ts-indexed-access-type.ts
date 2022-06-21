import { isStringLiteral, TSIndexedAccessType, TSType } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  indexExpression,
  isLiteralType,
  isTypeNumber,
  isTypeReference,
  isTypeUnion,
  LuaType,
  memberExpression,
  numericLiteral,
  tableConstructor,
  typeAny,
  typeCastExpression,
  typeofExpression,
  typeUnion,
} from '@js-to-lua/lua-types';

export const createTsIndexedAccessTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaType, TSIndexedAccessType>(
    'TSIndexedAccessType',
    (source, config, node: TSIndexedAccessType) => {
      const handledObjectType = typesHandlerFunction(
        source,
        config,
        node.objectType
      ) as LuaType;

      const handledIndexType = typesHandlerFunction(
        source,
        config,
        node.indexType
      ) as LuaType;

      const src = getNodeSource(source, node);

      return handle(handledObjectType, handledIndexType, src);

      function handle(object: LuaType, index: LuaType, src: string): LuaType {
        if (isTypeReference(index)) {
          return withTrailingConversionComment(
            typeAny(),
            'ROBLOX FIXME: Luau types cannot be used for indexing.',
            'Upstream: ' + src
          );
        }

        if (isTypeNumber(index)) {
          return withTrailingConversionComment(
            typeofExpression(
              indexExpression(
                typeCastExpression(
                  typeCastExpression(tableConstructor(), typeAny()),
                  object
                ),
                numericLiteral(1)
              )
            ),
            'ROBLOX CHECK: Resulting type may differ',
            'Upstream: ' + src
          );
        }

        if (isLiteralType(index) && isStringLiteral(index.literal)) {
          return typeofExpression(
            memberExpression(
              typeCastExpression(
                typeCastExpression(tableConstructor(), typeAny()),
                object
              ),
              '.',
              identifier(index.literal.value)
            )
          );
        }

        if (isTypeUnion(index)) {
          return typeUnion(index.types.map((t) => handle(object, t, src)));
        }

        return withTrailingConversionComment(
          typeAny(),
          'ROBLOX FIXME: Unhandled type.',
          'Upstream: ' + src
        );
      }
    }
  );
