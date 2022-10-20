import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  isValidIdentifier,
  luaReservedKeywords,
  reassignComments,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  isLiteralType,
  isStringLiteral,
  LuaIdentifier,
  LuaNode,
  LuaType,
  LuaTypeElement,
  typeAnnotation,
  typeIndexSignature,
  typePropertySignature,
} from '@js-to-lua/lua-types';

export const createObjectTypeIndexerHandler = (
  handleFlowType: HandlerFunction<LuaType, Babel.FlowType>
) => {
  return createHandlerFunction<LuaTypeElement, Babel.ObjectTypeIndexer>(
    (source, config, node) => {
      const key = handleFlowType(source, config, node.key);
      const annotation = typeAnnotation(
        handleFlowType(source, config, node.value)
      );

      if (
        isLiteralType(key) &&
        isStringLiteral(key.literal) &&
        isValidIdentifier(key.literal.value) &&
        !luaReservedKeywords.includes(key.literal.value)
      ) {
        const literalValue = reassignComments<LuaIdentifier, LuaNode>(
          identifier(key.literal.value),
          key.literal,
          key
        );

        return typePropertySignature(literalValue, annotation);
      }

      return typeIndexSignature(key, annotation);
    }
  );
};
