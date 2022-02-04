import {
  isTSArrayType,
  isTSTypeAnnotation,
  RestElement,
  TSType,
} from '@babel/types';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';

export const createRestElementHandler =
  (
    typesHandlerFunction: HandlerFunction<LuaType, TSType>
  ): ((
    source: string,
    config: EmptyConfig,
    node: RestElement
  ) => LuaIdentifier) =>
  (source, config, node) => {
    let knownType;
    if (
      node.typeAnnotation &&
      isTSTypeAnnotation(node.typeAnnotation) &&
      isTSArrayType(node.typeAnnotation.typeAnnotation)
    ) {
      knownType = typeAnnotation(
        typesHandlerFunction(
          source,
          config,
          node.typeAnnotation.typeAnnotation.elementType
        )
      );
    }

    const res = identifier('...', knownType || typeAnnotation(typeAny()));
    return knownType
      ? res
      : withTrailingConversionComment(
          res,
          `ROBLOX CHECK: check correct type of elements.${
            node.typeAnnotation
              ? ' Upstream type: <' +
                source
                  .slice(
                    node.typeAnnotation.start || 0,
                    node.typeAnnotation.end || 0
                  )
                  .replace(':', '')
                  .trim() +
                '>'
              : ''
          }`
        );
  };
