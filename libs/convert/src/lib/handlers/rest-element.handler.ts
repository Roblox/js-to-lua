import * as Babel from '@babel/types';
import {
  isArrayTypeAnnotation,
  isTSArrayType,
  isTSTypeAnnotation,
  isTypeAnnotation,
  RestElement,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { LuaType, typeAnnotation, typeAny } from '@js-to-lua/lua-types';

export const createRestElementHandler =
  (
    typesHandlerFunction: HandlerFunction<
      LuaType,
      Babel.FlowType | Babel.TSType
    >
  ): ((source: string, config: EmptyConfig, node: RestElement) => LuaType) =>
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

    if (
      node.typeAnnotation &&
      isTypeAnnotation(node.typeAnnotation) &&
      isArrayTypeAnnotation(node.typeAnnotation.typeAnnotation)
    ) {
      knownType = typeAnnotation(
        typesHandlerFunction(
          source,
          config,
          node.typeAnnotation.typeAnnotation.elementType
        )
      );
    }

    return knownType
      ? knownType.typeAnnotation
      : withTrailingConversionComment(
          typeAny(),
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
